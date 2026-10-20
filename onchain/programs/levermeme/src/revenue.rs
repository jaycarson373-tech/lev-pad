//! Creator fee routing and postcondition-protected, atomic buyback-and-burn.
//! Never grants a swap authority over user margin or market reserve PDAs.
use crate::{pay_quote, validate_mint, ErrorCode, Protocol, CURVE_DISC, PUMP_ID};
use anchor_lang::prelude::*;
use anchor_lang::solana_program::{
    instruction::{AccountMeta, Instruction},
    program::invoke,
};
use anchor_lang::system_program;
use anchor_spl::token_interface::{self, BurnChecked, Mint, TokenAccount, TokenInterface};

pub const JUPITER_ID: Pubkey = pubkey!("JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4");
pub const PUMP_AMM_ID: Pubkey = pubkey!("pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA");
pub const WSOL: Pubkey = pubkey!("So11111111111111111111111111111111111111112");
// Pinned official pump-public-docs IDL instruction discriminators. Tests compare
// these to the vendored public IDLs; external layouts are never guessed.
pub const COLLECT_NATIVE: [u8; 8] = [20, 22, 86, 123, 198, 28, 219, 132];
pub const COLLECT_QUOTE: [u8; 8] = [207, 17, 138, 242, 4, 34, 19, 56];
pub const COLLECT_AMM: [u8; 8] = [160, 57, 89, 42, 181, 139, 43, 66];
pub const POOL_DISC: [u8; 8] = [241, 154, 109, 4, 17, 177, 109, 188];

#[account]
#[derive(InitSpace)]
pub struct RevenueLedger {
    pub protocol: Pubkey,
    pub native_creator_collected: u64,
    pub wsol_creator_collected: u64,
    pub quote_creator_collected: u64,
    pub quote_buyback_spent: u64,
    pub wsol_buyback_spent: u64,
    pub buyback_burned: u64,
}
pub fn wrap_sol(ctx: Context<WrapBuybackSol>, amount: u64) -> Result<()> {
    require!(!ctx.accounts.protocol.paused, ErrorCode::Paused);
    require!(
        amount > 0 && ctx.accounts.wsol_tokens.is_native.is_some(),
        ErrorCode::BuybackBounds
    );
    let before = ctx.accounts.wsol_tokens.amount;
    system_program::transfer(
        CpiContext::new(
            system_program::ID,
            system_program::Transfer {
                from: ctx.accounts.authority.to_account_info(),
                to: ctx.accounts.wsol_tokens.to_account_info(),
            },
        ),
        amount,
    )?;
    anchor_spl::token::sync_native(CpiContext::new(
        anchor_spl::token::ID,
        anchor_spl::token::SyncNative {
            account: ctx.accounts.wsol_tokens.to_account_info(),
        },
    ))?;
    ctx.accounts.wsol_tokens.reload()?;
    require!(
        ctx.accounts.wsol_tokens.amount.checked_sub(before) == Some(amount),
        ErrorCode::BuybackBounds
    );
    Ok(())
}
fn add(a: u64, b: u64) -> Result<u64> {
    a.checked_add(b).ok_or_else(|| error!(ErrorCode::Overflow))
}
fn accepted_input(mint: &InterfaceAccount<Mint>, protocol: &Protocol) -> Result<()> {
    require!(
        mint.key() == protocol.quote_mint || mint.key() == WSOL,
        ErrorCode::BuybackRoute
    );
    validate_mint(mint)
}
fn creator_curve(info: &AccountInfo, mint: Pubkey, creator: Pubkey) -> Result<Pubkey> {
    require_keys_eq!(*info.owner, PUMP_ID, ErrorCode::CreatorIdentity);
    require_keys_eq!(
        info.key(),
        Pubkey::find_program_address(&[b"bonding-curve", mint.as_ref()], &PUMP_ID).0,
        ErrorCode::CreatorIdentity
    );
    let data = info.try_borrow_data()?;
    require!(
        data.len() >= 81 && data[..8] == CURVE_DISC && data[49..81] == creator.to_bytes(),
        ErrorCode::CreatorIdentity
    );
    // Legacy curves leave this future field zero; native SOL is represented by
    // the System Program key. Token-quoted curves store the actual quote mint.
    Ok(if data.len() >= 115 {
        Pubkey::new_from_array(
            data[83..115]
                .try_into()
                .map_err(|_| error!(ErrorCode::CreatorIdentity))?,
        )
    } else {
        Pubkey::default()
    })
}
fn creator_pool(info: &AccountInfo, mint: Pubkey, quote: Pubkey, creator: Pubkey) -> Result<()> {
    require_keys_eq!(*info.owner, PUMP_AMM_ID, ErrorCode::CreatorIdentity);
    let authority = Pubkey::find_program_address(&[b"pool-authority", mint.as_ref()], &PUMP_ID).0;
    let expected = Pubkey::find_program_address(
        &[
            b"pool",
            &0u16.to_le_bytes(),
            authority.as_ref(),
            mint.as_ref(),
            quote.as_ref(),
        ],
        &PUMP_AMM_ID,
    )
    .0;
    require_keys_eq!(info.key(), expected, ErrorCode::CreatorIdentity);
    let data = info.try_borrow_data()?;
    require!(
        data.len() >= 243
            && data[..8] == POOL_DISC
            && data[9..11] == [0, 0]
            && data[11..43] == authority.to_bytes()
            && data[43..75] == mint.to_bytes()
            && data[75..107] == quote.to_bytes()
            && data[211..243] == creator.to_bytes(),
        ErrorCode::CreatorIdentity
    );
    Ok(())
}

pub fn buyback<'info>(
    ctx: Context<'info, ExecuteBuyback<'info>>,
    input_amount: u64,
    minimum_output: u64,
    swap_data: Vec<u8>,
) -> Result<()> {
    require!(!ctx.accounts.protocol.paused, ErrorCode::Paused);
    require!(
        input_amount > 0 && minimum_output > 0 && !swap_data.is_empty() && swap_data.len() <= 1024,
        ErrorCode::BuybackBounds
    );
    accepted_input(&ctx.accounts.input_mint, &ctx.accounts.protocol)?;
    validate_mint(&ctx.accounts.lever_mint)?;
    require_keys_neq!(
        ctx.accounts.input_mint.key(),
        ctx.accounts.lever_mint.key(),
        ErrorCode::SameMint
    );
    require!(
        ctx.remaining_accounts.len() >= 4 && ctx.remaining_accounts.len() <= 64,
        ErrorCode::BuybackRoute
    );
    let authority = ctx.accounts.authority.key();
    let before_input = ctx.accounts.input_tokens.amount;
    let before_output = ctx.accounts.lever_tokens.amount;
    let before_supply = ctx.accounts.lever_mint.supply;
    let before_sol = ctx.accounts.authority.lamports();
    let mut metas = Vec::with_capacity(ctx.remaining_accounts.len());
    let mut saw_input = false;
    let mut saw_output = false;
    let mut saw_authority = false;
    for account in ctx.remaining_accounts {
        // No protocol state, collateral, delegated signer or unrelated writable
        // wallet token account may be offered to an external route.
        require!(
            *account.owner != crate::ID && (!account.is_signer || account.key() == authority),
            ErrorCode::BuybackRoute
        );
        if account.is_writable
            && (*account.owner == anchor_spl::token::ID
                || *account.owner == anchor_spl::token_2022::ID)
        {
            let bytes = account.try_borrow_data()?;
            require!(bytes.len() >= 64, ErrorCode::BuybackRoute);
            if bytes[32..64] == authority.to_bytes() {
                require!(
                    account.key() == ctx.accounts.input_tokens.key()
                        || account.key() == ctx.accounts.lever_tokens.key(),
                    ErrorCode::BuybackRoute
                );
            }
        }
        saw_input |= account.key() == ctx.accounts.input_tokens.key();
        saw_output |= account.key() == ctx.accounts.lever_tokens.key();
        saw_authority |= account.key() == authority;
        metas.push(if account.is_writable {
            AccountMeta::new(account.key(), account.is_signer)
        } else {
            AccountMeta::new_readonly(account.key(), account.is_signer)
        });
    }
    require!(
        saw_input && saw_output && saw_authority,
        ErrorCode::BuybackRoute
    );
    let mut infos = ctx.remaining_accounts.to_vec();
    infos.push(ctx.accounts.jupiter_program.to_account_info());
    invoke(
        &Instruction {
            program_id: JUPITER_ID,
            accounts: metas,
            data: swap_data,
        },
        &infos,
    )?;
    ctx.accounts.input_tokens.reload()?;
    ctx.accounts.lever_tokens.reload()?;
    ctx.accounts.lever_mint.reload()?;
    require!(
        before_input.checked_sub(ctx.accounts.input_tokens.amount) == Some(input_amount)
            && ctx.accounts.authority.lamports() >= before_sol
            && ctx.accounts.lever_mint.supply == before_supply,
        ErrorCode::BuybackBounds
    );
    let acquired = ctx
        .accounts
        .lever_tokens
        .amount
        .checked_sub(before_output)
        .ok_or(ErrorCode::BuybackBounds)?;
    require!(acquired >= minimum_output, ErrorCode::BuybackBounds);
    token_interface::burn_checked(
        CpiContext::new(
            ctx.accounts.lever_program.key(),
            BurnChecked {
                mint: ctx.accounts.lever_mint.to_account_info(),
                from: ctx.accounts.lever_tokens.to_account_info(),
                authority: ctx.accounts.authority.to_account_info(),
            },
        ),
        acquired,
        ctx.accounts.lever_mint.decimals,
    )?;
    ctx.accounts.lever_tokens.reload()?;
    ctx.accounts.lever_mint.reload()?;
    require!(
        ctx.accounts.lever_tokens.amount == before_output
            && before_supply.checked_sub(ctx.accounts.lever_mint.supply) == Some(acquired),
        ErrorCode::BuybackBounds
    );
    let ledger = &mut ctx.accounts.revenue;
    if ctx.accounts.input_mint.key() == WSOL {
        ledger.wsol_buyback_spent = add(ledger.wsol_buyback_spent, input_amount)?;
    } else {
        ledger.quote_buyback_spent = add(ledger.quote_buyback_spent, input_amount)?;
    }
    ledger.buyback_burned = add(ledger.buyback_burned, acquired)?;
    emit!(BuybackExecuted {
        protocol: ctx.accounts.protocol.key(),
        authority,
        input_mint: ctx.accounts.input_mint.key(),
        input_amount,
        burned: acquired
    });
    Ok(())
}

pub fn collect_native(ctx: Context<CollectNativeCreatorFees>) -> Result<()> {
    require!(
        creator_curve(
            &ctx.accounts.origin.to_account_info(),
            ctx.accounts.protocol.lever_mint,
            ctx.accounts.creator.key()
        )? == Pubkey::default(),
        ErrorCode::CreatorIdentity
    );
    let expected = Pubkey::find_program_address(
        &[b"creator-vault", ctx.accounts.creator.key().as_ref()],
        &PUMP_ID,
    )
    .0;
    require_keys_eq!(
        expected,
        ctx.accounts.creator_vault.key(),
        ErrorCode::CreatorIdentity
    );
    require_keys_eq!(
        ctx.accounts.event_authority.key(),
        Pubkey::find_program_address(&[b"__event_authority"], &PUMP_ID).0,
        ErrorCode::CreatorIdentity
    );
    let before = ctx.accounts.creator.lamports();
    let infos = [
        ctx.accounts.creator.to_account_info(),
        ctx.accounts.creator_vault.to_account_info(),
        ctx.accounts.system_program.to_account_info(),
        ctx.accounts.event_authority.to_account_info(),
        ctx.accounts.pump_program.to_account_info(),
    ];
    let accounts = vec![
        AccountMeta::new(ctx.accounts.creator.key(), false),
        AccountMeta::new(ctx.accounts.creator_vault.key(), false),
        AccountMeta::new_readonly(system_program::ID, false),
        AccountMeta::new_readonly(ctx.accounts.event_authority.key(), false),
        AccountMeta::new_readonly(PUMP_ID, false),
    ];
    invoke(
        &Instruction {
            program_id: PUMP_ID,
            accounts,
            data: COLLECT_NATIVE.to_vec(),
        },
        &infos,
    )?;
    let amount = ctx
        .accounts
        .creator
        .lamports()
        .checked_sub(before)
        .ok_or(ErrorCode::TransferDelta)?;
    require!(amount > 0, ErrorCode::InvalidAmount);
    let buyback = amount / 2;
    let treasury = amount.checked_sub(buyback).ok_or(ErrorCode::Overflow)?;
    let mut retained = 0u64;
    for (destination, n) in [
        (ctx.accounts.treasury.to_account_info(), treasury),
        (ctx.accounts.buyback_fund.to_account_info(), buyback),
    ] {
        if destination.key() == ctx.accounts.creator.key() {
            retained = add(retained, n)?;
        } else if n > 0 {
            system_program::transfer(
                CpiContext::new(
                    system_program::ID,
                    system_program::Transfer {
                        from: ctx.accounts.creator.to_account_info(),
                        to: destination,
                    },
                ),
                n,
            )?;
        }
    }
    require!(
        ctx.accounts.creator.lamports() == add(before, retained)?,
        ErrorCode::TransferDelta
    );
    ctx.accounts.revenue.native_creator_collected =
        add(ctx.accounts.revenue.native_creator_collected, amount)?;
    emit!(CreatorFeesCollected {
        protocol: ctx.accounts.protocol.key(),
        creator: ctx.accounts.creator.key(),
        mint: Pubkey::default(),
        amount,
        treasury,
        buyback,
        source_kind: 0
    });
    Ok(())
}

pub fn collect_quote<'info>(
    ctx: Context<'info, CollectQuoteCreatorFees<'info>>,
    source_kind: u8,
) -> Result<()> {
    require!(source_kind <= 1, ErrorCode::CreatorIdentity);
    accepted_input(&ctx.accounts.input_mint, &ctx.accounts.protocol)?;
    let creator = ctx.accounts.creator.key();
    let mint = ctx.accounts.input_mint.key();
    let program = if source_kind == 0 {
        PUMP_ID
    } else {
        PUMP_AMM_ID
    };
    require_keys_eq!(
        ctx.accounts.fee_program.key(),
        program,
        ErrorCode::CreatorIdentity
    );
    if source_kind == 0 {
        require_keys_eq!(
            creator_curve(
                &ctx.accounts.origin.to_account_info(),
                ctx.accounts.protocol.lever_mint,
                creator
            )?,
            mint,
            ErrorCode::CreatorIdentity
        );
    } else {
        creator_pool(
            &ctx.accounts.origin.to_account_info(),
            ctx.accounts.protocol.lever_mint,
            mint,
            creator,
        )?;
    }
    let seed: &[u8] = if source_kind == 0 {
        b"creator-vault"
    } else {
        b"creator_vault"
    };
    require_keys_eq!(
        ctx.accounts.vault_authority.key(),
        Pubkey::find_program_address(&[seed, creator.as_ref()], &program).0,
        ErrorCode::CreatorIdentity
    );
    require_keys_eq!(
        ctx.accounts.event_authority.key(),
        Pubkey::find_program_address(&[b"__event_authority"], &program).0,
        ErrorCode::CreatorIdentity
    );
    let before = ctx.accounts.creator_tokens.amount;
    let mut infos = vec![
        ctx.accounts.creator.to_account_info(),
        ctx.accounts.creator_tokens.to_account_info(),
        ctx.accounts.vault_authority.to_account_info(),
        ctx.accounts.fee_vault.to_account_info(),
        ctx.accounts.input_mint.to_account_info(),
        ctx.accounts.input_program.to_account_info(),
        ctx.accounts.associated_token_program.to_account_info(),
        ctx.accounts.system_program.to_account_info(),
        ctx.accounts.event_authority.to_account_info(),
        ctx.accounts.fee_program.to_account_info(),
    ];
    let mut accounts = if source_kind == 0 {
        vec![
            AccountMeta::new(creator, false),
            AccountMeta::new(ctx.accounts.creator_tokens.key(), false),
            AccountMeta::new(ctx.accounts.vault_authority.key(), false),
            AccountMeta::new(ctx.accounts.fee_vault.key(), false),
            AccountMeta::new_readonly(mint, false),
            AccountMeta::new_readonly(ctx.accounts.input_program.key(), false),
            AccountMeta::new_readonly(ctx.accounts.associated_token_program.key(), false),
            AccountMeta::new_readonly(system_program::ID, false),
        ]
    } else {
        vec![
            AccountMeta::new_readonly(mint, false),
            AccountMeta::new_readonly(ctx.accounts.input_program.key(), false),
            AccountMeta::new_readonly(creator, false),
            AccountMeta::new_readonly(ctx.accounts.vault_authority.key(), false),
            AccountMeta::new(ctx.accounts.fee_vault.key(), false),
            AccountMeta::new(ctx.accounts.creator_tokens.key(), false),
        ]
    };
    accounts.push(AccountMeta::new_readonly(
        ctx.accounts.event_authority.key(),
        false,
    ));
    accounts.push(AccountMeta::new_readonly(program, false));
    invoke(
        &Instruction {
            program_id: program,
            accounts,
            data: if source_kind == 0 {
                COLLECT_QUOTE.to_vec()
            } else {
                COLLECT_AMM.to_vec()
            },
        },
        &infos,
    )?;
    infos.clear();
    ctx.accounts.creator_tokens.reload()?;
    let amount = ctx
        .accounts
        .creator_tokens
        .amount
        .checked_sub(before)
        .ok_or(ErrorCode::TransferDelta)?;
    require!(amount > 0, ErrorCode::InvalidAmount);
    let buyback = amount / 2;
    let treasury = amount.checked_sub(buyback).ok_or(ErrorCode::Overflow)?;
    let mut retained = 0u64;
    for (destination, n) in [
        (ctx.accounts.treasury.to_account_info(), treasury),
        (ctx.accounts.buyback_fund.to_account_info(), buyback),
    ] {
        if destination.key() == ctx.accounts.creator_tokens.key() {
            retained = add(retained, n)?;
            continue;
        }
        pay_quote(
            ctx.accounts.creator_tokens.to_account_info(),
            destination,
            ctx.accounts.input_mint.to_account_info(),
            ctx.accounts.creator.to_account_info(),
            ctx.accounts.input_program.key(),
            n,
            ctx.accounts.input_mint.decimals,
        )?;
    }
    ctx.accounts.creator_tokens.reload()?;
    require!(
        ctx.accounts.creator_tokens.amount == add(before, retained)?,
        ErrorCode::TransferDelta
    );
    if mint == WSOL {
        ctx.accounts.revenue.wsol_creator_collected =
            add(ctx.accounts.revenue.wsol_creator_collected, amount)?;
    } else {
        ctx.accounts.revenue.quote_creator_collected =
            add(ctx.accounts.revenue.quote_creator_collected, amount)?;
    }
    emit!(CreatorFeesCollected {
        protocol: ctx.accounts.protocol.key(),
        creator,
        mint,
        amount,
        treasury,
        buyback,
        source_kind: source_kind.checked_add(1).ok_or(ErrorCode::Overflow)?
    });
    Ok(())
}

#[derive(Accounts)]
pub struct WrapBuybackSol<'info> {
    #[account(mut,address=protocol.policy.fee_destinations[2])]
    pub authority: Signer<'info>,
    #[account(seeds=[b"protocol",protocol.admin.as_ref()],bump=protocol.bump)]
    pub protocol: Box<Account<'info, Protocol>>,
    #[account(mut,token::mint=WSOL,token::authority=authority)]
    pub wsol_tokens: Box<Account<'info, anchor_spl::token::TokenAccount>>,
    pub token_program: Program<'info, anchor_spl::token::Token>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct ExecuteBuyback<'info> {
    #[account(address=protocol.policy.fee_destinations[2])]
    pub authority: Signer<'info>,
    #[account(seeds=[b"protocol",protocol.admin.as_ref()],bump=protocol.bump,has_one=lever_mint)]
    pub protocol: Box<Account<'info, Protocol>>,
    #[account(mut,seeds=[b"revenue",protocol.key().as_ref()],bump,has_one=protocol)]
    pub revenue: Box<Account<'info, RevenueLedger>>,
    #[account(mint::token_program=input_program)]
    pub input_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(mut,token::mint=input_mint,token::authority=authority,token::token_program=input_program)]
    pub input_tokens: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut,mint::token_program=lever_program)]
    pub lever_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(mut,token::mint=lever_mint,token::authority=authority,token::token_program=lever_program)]
    pub lever_tokens: Box<InterfaceAccount<'info, TokenAccount>>,
    pub input_program: Interface<'info, TokenInterface>,
    pub lever_program: Interface<'info, TokenInterface>,
    /// CHECK: Only this pinned executable may execute the swap; output enforced.
    #[account(address=JUPITER_ID,executable)]
    pub jupiter_program: UncheckedAccount<'info>,
}
#[derive(Accounts)]
pub struct CollectNativeCreatorFees<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,
    #[account(seeds=[b"protocol",protocol.admin.as_ref()],bump=protocol.bump)]
    pub protocol: Box<Account<'info, Protocol>>,
    #[account(mut,seeds=[b"revenue",protocol.key().as_ref()],bump,has_one=protocol)]
    pub revenue: Box<Account<'info, RevenueLedger>>,
    /// CHECK: Canonical LeverMeme curve owner, discriminator, mint and creator verified.
    pub origin: UncheckedAccount<'info>,
    /// CHECK: External canonical creator vault PDA, enforced by both programs.
    #[account(mut)]
    pub creator_vault: UncheckedAccount<'info>,
    /// CHECK: Destination owner is immutable protocol policy.
    #[account(mut,dup,address=protocol.policy.fee_destinations[0])]
    pub treasury: UncheckedAccount<'info>,
    /// CHECK: Destination owner is immutable protocol policy.
    #[account(mut,dup,address=protocol.policy.fee_destinations[2])]
    pub buyback_fund: UncheckedAccount<'info>,
    /// CHECK: Canonical pump event authority PDA verified before CPI.
    pub event_authority: UncheckedAccount<'info>,
    /// CHECK: Pinned executable, never a caller-selected CPI target.
    #[account(address=PUMP_ID,executable)]
    pub pump_program: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CollectQuoteCreatorFees<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,
    #[account(seeds=[b"protocol",protocol.admin.as_ref()],bump=protocol.bump)]
    pub protocol: Box<Account<'info, Protocol>>,
    #[account(mut,seeds=[b"revenue",protocol.key().as_ref()],bump,has_one=protocol)]
    pub revenue: Box<Account<'info, RevenueLedger>>,
    /// CHECK: Canonical LeverMeme curve or migrated pool, checked for source_kind.
    pub origin: UncheckedAccount<'info>,
    #[account(mint::token_program=input_program)]
    pub input_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(mut,dup,token::mint=input_mint,token::authority=creator,token::token_program=input_program)]
    pub creator_tokens: Box<InterfaceAccount<'info, TokenAccount>>,
    /// CHECK: Canonical vault PDA of the pinned external fee program.
    #[account(mut)]
    pub vault_authority: UncheckedAccount<'info>,
    #[account(mut,associated_token::mint=input_mint,associated_token::authority=vault_authority,associated_token::token_program=input_program)]
    pub fee_vault: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut,dup,token::mint=input_mint,token::authority=protocol.policy.fee_destinations[0],token::token_program=input_program)]
    pub treasury: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut,dup,token::mint=input_mint,token::authority=protocol.policy.fee_destinations[2],token::token_program=input_program)]
    pub buyback_fund: Box<InterfaceAccount<'info, TokenAccount>>,
    /// CHECK: Source kind selects only PUMP_ID or PUMP_AMM_ID, checked before CPI.
    #[account(executable)]
    pub fee_program: UncheckedAccount<'info>,
    /// CHECK: External canonical event PDA checked before CPI.
    pub event_authority: UncheckedAccount<'info>,
    pub input_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, anchor_spl::associated_token::AssociatedToken>,
    pub system_program: Program<'info, System>,
}
#[event]
pub struct BuybackExecuted {
    pub protocol: Pubkey,
    pub authority: Pubkey,
    pub input_mint: Pubkey,
    pub input_amount: u64,
    pub burned: u64,
}
#[event]
pub struct CreatorFeesCollected {
    pub protocol: Pubkey,
    pub creator: Pubkey,
    pub mint: Pubkey,
    pub amount: u64,
    pub treasury: u64,
    pub buyback: u64,
    pub source_kind: u8,
}
