//! Listing admission and segregated collateral custody.
//! This version deliberately has no position execution or liquidation instruction.
use anchor_lang::prelude::*;
use anchor_lang::system_program;
use anchor_spl::token_interface::spl_token_2022::{
    self,
    extension::{BaseStateWithExtensions, ExtensionType, StateWithExtensions},
};
use anchor_spl::token_interface::{
    self, BurnChecked, Mint, TokenAccount, TokenInterface, TransferChecked,
};

pub mod math;

// Public Anchor template address. Release tooling rejects it for deployment.
declare_id!("Fg6PaFpoGXkYsidMpWxTWqkZ7FEfcYkgMQhgS1h5A9t");
pub const PUMP_ID: Pubkey = pubkey!("6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P");
pub const CURVE_DISC: [u8; 8] = [23, 183, 248, 55, 96, 216, 172, 96];

#[program]
pub mod levermeme {
    use super::*;

    /// Each administrator gets its own namespace. Clients pin the intended config
    /// PDA; an attacker cannot initialize or replace someone else's namespace.
    pub fn initialize_protocol(
        ctx: Context<InitializeProtocol>,
        policy: ListingPolicy,
    ) -> Result<()> {
        policy.validate()?;
        validate_mint(&ctx.accounts.lever_mint)?;
        validate_mint(&ctx.accounts.quote_mint)?;
        require_keys_neq!(
            ctx.accounts.lever_mint.key(),
            ctx.accounts.quote_mint.key(),
            ErrorCode::SameMint
        );
        let protocol = &mut ctx.accounts.protocol;
        protocol.version = 1;
        protocol.admin = ctx.accounts.admin.key();
        protocol.lever_mint = ctx.accounts.lever_mint.key();
        protocol.quote_mint = ctx.accounts.quote_mint.key();
        protocol.policy = policy;
        protocol.paused = true;
        protocol.bump = ctx.bumps.protocol;
        protocol.total_burned = 0;
        protocol.listing_count = 0;
        protocol.initial_supply = ctx.accounts.lever_mint.supply;
        protocol.platform_revenue = 0;
        protocol.token_creator_revenue = 0;
        emit!(ProtocolCreated {
            protocol: protocol.key(),
            admin: protocol.admin
        });
        Ok(())
    }

    /// Pausing stops new burns and deposits. Exits remain permissionless to owners.
    pub fn set_paused(ctx: Context<AdminProtocol>, paused: bool) -> Result<()> {
        ctx.accounts.protocol.paused = paused;
        emit!(PauseChanged {
            protocol: ctx.accounts.protocol.key(),
            paused
        });
        Ok(())
    }

    /// Distribute actual quote tokens owned by the operator. This does not
    /// withdraw user collateral or claim that a derivative trade took place.
    pub fn route_platform_revenue(ctx: Context<RoutePlatformRevenue>, amount: u64) -> Result<()> {
        require!(
            amount > 0 && ctx.accounts.listing.approved && !ctx.accounts.listing.cancelled,
            ErrorCode::NotApproved
        );
        validate_mint(&ctx.accounts.quote_mint)?;
        let parts = math::split_fee(amount, ctx.accounts.protocol.policy.fee_shares)
            .ok_or(ErrorCode::InvalidPolicy)?;
        let total = ctx
            .accounts
            .protocol
            .platform_revenue
            .checked_add(amount)
            .ok_or(ErrorCode::Overflow)?;
        for (destination, allocation) in [
            ctx.accounts.treasury.to_account_info(),
            ctx.accounts.campaign_fund.to_account_info(),
            ctx.accounts.creator.to_account_info(),
            ctx.accounts.buyback_fund.to_account_info(),
        ]
        .into_iter()
        .zip(parts)
        {
            pay_quote(
                ctx.accounts.source.to_account_info(),
                destination,
                ctx.accounts.quote_mint.to_account_info(),
                ctx.accounts.admin.to_account_info(),
                ctx.accounts.quote_program.key(),
                allocation,
                ctx.accounts.quote_mint.decimals,
            )?;
        }
        ctx.accounts.protocol.platform_revenue = total;
        emit!(RevenueRouted {
            protocol: ctx.accounts.protocol.key(),
            amount,
            kind: 0,
            parts
        });
        Ok(())
    }

    /// LeverMeme's own creator revenue, after collection/conversion to xSOL,
    /// routes 50/50. A buyback allocation is not itself a swap or token burn.
    pub fn route_token_creator_revenue(
        ctx: Context<RouteTokenCreatorRevenue>,
        amount: u64,
    ) -> Result<()> {
        require!(amount > 0, ErrorCode::InvalidAmount);
        validate_mint(&ctx.accounts.quote_mint)?;
        let parts = math::split_fee(amount, [5000, 0, 0, 5000]).ok_or(ErrorCode::InvalidPolicy)?;
        let total = ctx
            .accounts
            .protocol
            .token_creator_revenue
            .checked_add(amount)
            .ok_or(ErrorCode::Overflow)?;
        pay_quote(
            ctx.accounts.source.to_account_info(),
            ctx.accounts.treasury.to_account_info(),
            ctx.accounts.quote_mint.to_account_info(),
            ctx.accounts.admin.to_account_info(),
            ctx.accounts.quote_program.key(),
            parts[0],
            ctx.accounts.quote_mint.decimals,
        )?;
        pay_quote(
            ctx.accounts.source.to_account_info(),
            ctx.accounts.buyback_fund.to_account_info(),
            ctx.accounts.quote_mint.to_account_info(),
            ctx.accounts.admin.to_account_info(),
            ctx.accounts.quote_program.key(),
            parts[3],
            ctx.accounts.quote_mint.decimals,
        )?;
        ctx.accounts.protocol.token_creator_revenue = total;
        emit!(RevenueRouted {
            protocol: ctx.accounts.protocol.key(),
            amount,
            kind: 1,
            parts
        });
        Ok(())
    }

    /// All three effects are atomic: burn, meme-token escrow and SOL escrow.
    /// Listing requests are not active derivative markets.
    pub fn request_listing(
        ctx: Context<RequestListing>,
        sol_lamports: u64,
        token_amount: u64,
    ) -> Result<()> {
        require!(!ctx.accounts.protocol.paused, ErrorCode::Paused);
        require!(
            sol_lamports >= ctx.accounts.protocol.policy.min_sol_lamports && token_amount > 0,
            ErrorCode::InvalidAmount
        );
        validate_mint(&ctx.accounts.base_mint)?;
        validate_mint(&ctx.accounts.lever_mint)?;
        require_keys_neq!(
            ctx.accounts.base_mint.key(),
            ctx.accounts.protocol.lever_mint,
            ErrorCode::SameMint
        );
        require_keys_neq!(
            ctx.accounts.base_mint.key(),
            ctx.accounts.protocol.quote_mint,
            ErrorCode::SameMint
        );
        validate_curve(&ctx.accounts.pump_curve.to_account_info())?;
        let burn_amount = ctx.accounts.protocol.policy.burn_amount;
        token_interface::burn_checked(
            CpiContext::new(
                ctx.accounts.lever_program.key(),
                BurnChecked {
                    mint: ctx.accounts.lever_mint.to_account_info(),
                    from: ctx.accounts.lever_source.to_account_info(),
                    authority: ctx.accounts.lister.to_account_info(),
                },
            ),
            burn_amount,
            ctx.accounts.lever_mint.decimals,
        )?;
        let before = ctx.accounts.base_vault.amount;
        token_interface::transfer_checked(
            CpiContext::new(
                ctx.accounts.base_program.key(),
                TransferChecked {
                    from: ctx.accounts.base_source.to_account_info(),
                    mint: ctx.accounts.base_mint.to_account_info(),
                    to: ctx.accounts.base_vault.to_account_info(),
                    authority: ctx.accounts.lister.to_account_info(),
                },
            ),
            token_amount,
            ctx.accounts.base_mint.decimals,
        )?;
        ctx.accounts.base_vault.reload()?;
        require!(
            ctx.accounts.base_vault.amount.checked_sub(before) == Some(token_amount),
            ErrorCode::TransferDelta
        );
        system_program::transfer(
            CpiContext::new(
                system_program::ID,
                system_program::Transfer {
                    from: ctx.accounts.lister.to_account_info(),
                    to: ctx.accounts.listing.to_account_info(),
                },
            ),
            sol_lamports,
        )?;
        let listing = &mut ctx.accounts.listing;
        listing.protocol = ctx.accounts.protocol.key();
        listing.lister = ctx.accounts.lister.key();
        listing.base_mint = ctx.accounts.base_mint.key();
        listing.base_vault = ctx.accounts.base_vault.key();
        listing.sol_lamports = sol_lamports;
        listing.token_amount = token_amount;
        listing.burned = burn_amount;
        listing.cancelled = false;
        listing.approved = false;
        listing.bump = ctx.bumps.listing;
        listing.requested_at = Clock::get()?.unix_timestamp;
        let protocol = &mut ctx.accounts.protocol;
        protocol.total_burned = protocol
            .total_burned
            .checked_add(burn_amount)
            .ok_or(ErrorCode::Overflow)?;
        protocol.listing_count = protocol
            .listing_count
            .checked_add(1)
            .ok_or(ErrorCode::Overflow)?;
        emit!(ListingRequested {
            listing: listing.key(),
            lister: listing.lister,
            base_mint: listing.base_mint,
            sol_lamports,
            token_amount,
            burned: burn_amount
        });
        Ok(())
    }

    /// The lister can reclaim both liquidity assets, even while paused.
    /// The admission burn is irreversible. The tombstone prevents replay/relisting.
    pub fn cancel_listing(ctx: Context<CancelListing>) -> Result<()> {
        require!(!ctx.accounts.listing.cancelled, ErrorCode::AlreadyCancelled);
        let protocol_key = ctx.accounts.listing.protocol;
        let mint_key = ctx.accounts.listing.base_mint;
        let bump = [ctx.accounts.listing.bump];
        let seeds: &[&[u8]] = &[b"listing", protocol_key.as_ref(), mint_key.as_ref(), &bump];
        token_interface::transfer_checked(
            CpiContext::new_with_signer(
                ctx.accounts.base_program.key(),
                TransferChecked {
                    from: ctx.accounts.base_vault.to_account_info(),
                    mint: ctx.accounts.base_mint.to_account_info(),
                    to: ctx.accounts.base_destination.to_account_info(),
                    authority: ctx.accounts.listing.to_account_info(),
                },
                &[seeds],
            ),
            ctx.accounts.listing.token_amount,
            ctx.accounts.base_mint.decimals,
        )?;
        let amount = ctx.accounts.listing.sol_lamports;
        let listing_info = ctx.accounts.listing.to_account_info();
        let lister_info = ctx.accounts.lister.to_account_info();
        let remaining = listing_info
            .lamports()
            .checked_sub(amount)
            .ok_or(ErrorCode::InsufficientFunds)?;
        require!(
            remaining >= Rent::get()?.minimum_balance(listing_info.data_len()),
            ErrorCode::InsufficientFunds
        );
        let owner_balance = lister_info
            .lamports()
            .checked_add(amount)
            .ok_or(ErrorCode::Overflow)?;
        **listing_info.try_borrow_mut_lamports()? = remaining;
        **lister_info.try_borrow_mut_lamports()? = owner_balance;
        ctx.accounts.listing.cancelled = true;
        ctx.accounts.listing.approved = false;
        ctx.accounts.listing.sol_lamports = 0;
        ctx.accounts.listing.token_amount = 0;
        emit!(ListingCancelled {
            listing: ctx.accounts.listing.key(),
            lister: ctx.accounts.lister.key()
        });
        Ok(())
    }

    pub fn open_margin_account(ctx: Context<OpenMarginAccount>) -> Result<()> {
        validate_mint(&ctx.accounts.quote_mint)?;
        let margin = &mut ctx.accounts.margin;
        margin.protocol = ctx.accounts.protocol.key();
        margin.owner = ctx.accounts.owner.key();
        margin.vault = ctx.accounts.quote_vault.key();
        margin.balance = 0;
        margin.bump = ctx.bumps.margin;
        Ok(())
    }

    /// Admission approval is explicit. This does not activate derivative trading.
    pub fn set_listing_approved(ctx: Context<ReviewListing>, approved: bool) -> Result<()> {
        require!(!ctx.accounts.listing.cancelled, ErrorCode::AlreadyCancelled);
        require!(
            ctx.accounts.listing.sol_lamports >= ctx.accounts.protocol.policy.min_sol_lamports
                && ctx.accounts.listing.token_amount > 0,
            ErrorCode::InvalidAmount
        );
        ctx.accounts.listing.approved = approved;
        emit!(ListingReviewed {
            listing: ctx.accounts.listing.key(),
            approved
        });
        Ok(())
    }

    /// One funded supply-airdrop campaign per protocol, exactly 10% of the
    /// immutable supply checkpoint captured at protocol initialization.
    pub fn create_airdrop(
        ctx: Context<CreateAirdrop>,
        root: [u8; 32],
        starts_at: i64,
        ends_at: i64,
    ) -> Result<()> {
        require!(
            root != [0; 32] && starts_at >= Clock::get()?.unix_timestamp && ends_at > starts_at,
            ErrorCode::InvalidCampaign
        );
        validate_mint(&ctx.accounts.lever_mint)?;
        let total = ctx.accounts.protocol.initial_supply / 10;
        require!(total > 0, ErrorCode::InvalidAmount);
        let before = ctx.accounts.airdrop_vault.amount;
        token_interface::transfer_checked(
            CpiContext::new(
                ctx.accounts.lever_program.key(),
                TransferChecked {
                    from: ctx.accounts.source.to_account_info(),
                    mint: ctx.accounts.lever_mint.to_account_info(),
                    to: ctx.accounts.airdrop_vault.to_account_info(),
                    authority: ctx.accounts.admin.to_account_info(),
                },
            ),
            total,
            ctx.accounts.lever_mint.decimals,
        )?;
        ctx.accounts.airdrop_vault.reload()?;
        require!(
            ctx.accounts.airdrop_vault.amount.checked_sub(before) == Some(total),
            ErrorCode::TransferDelta
        );
        let campaign = &mut ctx.accounts.campaign;
        campaign.protocol = ctx.accounts.protocol.key();
        campaign.root = root;
        campaign.total = total;
        campaign.claimed = 0;
        campaign.starts_at = starts_at;
        campaign.ends_at = ends_at;
        campaign.reclaimed = false;
        campaign.bump = ctx.bumps.campaign;
        emit!(AirdropCreated {
            campaign: campaign.key(),
            total,
            starts_at,
            ends_at
        });
        Ok(())
    }

    pub fn claim_airdrop(
        ctx: Context<ClaimAirdrop>,
        index: u64,
        amount: u64,
        proof: Vec<[u8; 32]>,
    ) -> Result<()> {
        let now = Clock::get()?.unix_timestamp;
        require!(
            now >= ctx.accounts.campaign.starts_at
                && now < ctx.accounts.campaign.ends_at
                && !ctx.accounts.campaign.reclaimed,
            ErrorCode::CampaignClosed
        );
        require!(amount > 0 && proof.len() <= 24, ErrorCode::InvalidCampaign);
        let campaign_key = ctx.accounts.campaign.key();
        let leaf = airdrop_leaf(campaign_key, ctx.accounts.owner.key(), index, amount);
        require!(
            verify_proof(leaf, &proof, ctx.accounts.campaign.root),
            ErrorCode::InvalidProof
        );
        let new_claimed = ctx
            .accounts
            .campaign
            .claimed
            .checked_add(amount)
            .ok_or(ErrorCode::Overflow)?;
        require!(
            new_claimed <= ctx.accounts.campaign.total,
            ErrorCode::InsufficientFunds
        );
        let protocol_key = ctx.accounts.protocol.key();
        let bump = [ctx.accounts.campaign.bump];
        let seeds: &[&[u8]] = &[b"airdrop", protocol_key.as_ref(), &bump];
        token_interface::transfer_checked(
            CpiContext::new_with_signer(
                ctx.accounts.lever_program.key(),
                TransferChecked {
                    from: ctx.accounts.airdrop_vault.to_account_info(),
                    mint: ctx.accounts.lever_mint.to_account_info(),
                    to: ctx.accounts.destination.to_account_info(),
                    authority: ctx.accounts.campaign.to_account_info(),
                },
                &[seeds],
            ),
            amount,
            ctx.accounts.lever_mint.decimals,
        )?;
        ctx.accounts.campaign.claimed = new_claimed;
        ctx.accounts.claim.campaign = campaign_key;
        ctx.accounts.claim.owner = ctx.accounts.owner.key();
        ctx.accounts.claim.index = index;
        ctx.accounts.claim.amount = amount;
        emit!(AirdropClaimed {
            campaign: campaign_key,
            owner: ctx.accounts.owner.key(),
            amount
        });
        Ok(())
    }

    /// Expired leftovers go only to the original administrator's token account.
    pub fn reclaim_airdrop(ctx: Context<ReclaimAirdrop>) -> Result<()> {
        require!(
            Clock::get()?.unix_timestamp >= ctx.accounts.campaign.ends_at
                && !ctx.accounts.campaign.reclaimed,
            ErrorCode::CampaignClosed
        );
        let remaining = ctx
            .accounts
            .campaign
            .total
            .checked_sub(ctx.accounts.campaign.claimed)
            .ok_or(ErrorCode::Overflow)?;
        let protocol_key = ctx.accounts.protocol.key();
        let bump = [ctx.accounts.campaign.bump];
        let seeds: &[&[u8]] = &[b"airdrop", protocol_key.as_ref(), &bump];
        if remaining > 0 {
            token_interface::transfer_checked(
                CpiContext::new_with_signer(
                    ctx.accounts.lever_program.key(),
                    TransferChecked {
                        from: ctx.accounts.airdrop_vault.to_account_info(),
                        mint: ctx.accounts.lever_mint.to_account_info(),
                        to: ctx.accounts.destination.to_account_info(),
                        authority: ctx.accounts.campaign.to_account_info(),
                    },
                    &[seeds],
                ),
                remaining,
                ctx.accounts.lever_mint.decimals,
            )?;
        }
        ctx.accounts.campaign.reclaimed = true;
        Ok(())
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        require!(!ctx.accounts.protocol.paused, ErrorCode::Paused);
        require!(amount > 0, ErrorCode::InvalidAmount);
        validate_mint(&ctx.accounts.quote_mint)?;
        let before = ctx.accounts.quote_vault.amount;
        let new_balance = ctx
            .accounts
            .margin
            .balance
            .checked_add(amount)
            .ok_or(ErrorCode::Overflow)?;
        token_interface::transfer_checked(
            CpiContext::new(
                ctx.accounts.quote_program.key(),
                TransferChecked {
                    from: ctx.accounts.source.to_account_info(),
                    mint: ctx.accounts.quote_mint.to_account_info(),
                    to: ctx.accounts.quote_vault.to_account_info(),
                    authority: ctx.accounts.owner.to_account_info(),
                },
            ),
            amount,
            ctx.accounts.quote_mint.decimals,
        )?;
        ctx.accounts.quote_vault.reload()?;
        require!(
            ctx.accounts.quote_vault.amount.checked_sub(before) == Some(amount),
            ErrorCode::TransferDelta
        );
        ctx.accounts.margin.balance = new_balance;
        emit!(CollateralChanged {
            margin: ctx.accounts.margin.key(),
            owner: ctx.accounts.owner.key(),
            amount,
            deposit: true,
            balance: new_balance
        });
        Ok(())
    }

    /// No administrator can redirect a user's collateral. There is no trading
    /// instruction in this release; no margin can be locked or reallocated.
    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        require!(amount > 0, ErrorCode::InvalidAmount);
        let balance = ctx
            .accounts
            .margin
            .balance
            .checked_sub(amount)
            .ok_or(ErrorCode::InsufficientFunds)?;
        let protocol_key = ctx.accounts.margin.protocol;
        let owner_key = ctx.accounts.margin.owner;
        let bump = [ctx.accounts.margin.bump];
        let seeds: &[&[u8]] = &[b"margin", protocol_key.as_ref(), owner_key.as_ref(), &bump];
        token_interface::transfer_checked(
            CpiContext::new_with_signer(
                ctx.accounts.quote_program.key(),
                TransferChecked {
                    from: ctx.accounts.quote_vault.to_account_info(),
                    mint: ctx.accounts.quote_mint.to_account_info(),
                    to: ctx.accounts.destination.to_account_info(),
                    authority: ctx.accounts.margin.to_account_info(),
                },
                &[seeds],
            ),
            amount,
            ctx.accounts.quote_mint.decimals,
        )?;
        ctx.accounts.margin.balance = balance;
        emit!(CollateralChanged {
            margin: ctx.accounts.margin.key(),
            owner: ctx.accounts.owner.key(),
            amount,
            deposit: false,
            balance
        });
        Ok(())
    }
}

/// Only plain fungible transfers are accepted. Metadata extensions are inert
/// for accounting; transfer fees/hooks/delegates/close and future extensions fail.
fn validate_mint(mint: &InterfaceAccount<Mint>) -> Result<()> {
    require!(
        mint.is_initialized && mint.freeze_authority.is_none() && mint.mint_authority.is_none(),
        ErrorCode::UnsafeMint
    );
    if *mint.to_account_info().owner == spl_token_2022::ID {
        let info = mint.to_account_info();
        let data = info.try_borrow_data()?;
        let state = StateWithExtensions::<spl_token_2022::state::Mint>::unpack(&data)?;
        for extension in state.get_extension_types()? {
            require!(
                matches!(
                    extension,
                    ExtensionType::MetadataPointer | ExtensionType::TokenMetadata
                ),
                ErrorCode::UnsafeExtension
            );
        }
    }
    Ok(())
}

fn pay_quote<'info>(
    source: AccountInfo<'info>,
    destination: AccountInfo<'info>,
    mint: AccountInfo<'info>,
    authority: AccountInfo<'info>,
    program: Pubkey,
    amount: u64,
    decimals: u8,
) -> Result<()> {
    require_keys_neq!(source.key(), destination.key(), ErrorCode::InvalidPolicy);
    if amount > 0 {
        token_interface::transfer_checked(
            CpiContext::new(
                program,
                TransferChecked {
                    from: source,
                    to: destination,
                    mint,
                    authority,
                },
            ),
            amount,
            decimals,
        )?;
    }
    Ok(())
}

fn validate_curve(info: &AccountInfo) -> Result<()> {
    require_keys_eq!(*info.owner, PUMP_ID, ErrorCode::NotPump);
    let data = info.try_borrow_data()?;
    require!(
        data.len() >= 49 && data[..8] == CURVE_DISC && data[48] <= 1,
        ErrorCode::NotPump
    );
    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub struct ListingPolicy {
    pub burn_amount: u64,
    pub min_sol_lamports: u64,
    pub fee_bps: u16,
    /// Treasury/insurance, campaigns, market creator, buyback/burn.
    pub fee_shares: [u16; 4],
    /// Owners of treasury, campaign and buyback token accounts. The 5% royalty
    /// belongs to each approved listing's recorded lister, not a global owner.
    pub fee_destinations: [Pubkey; 3],
}
impl ListingPolicy {
    pub fn validate(&self) -> Result<()> {
        require!(
            self.burn_amount > 0 && self.min_sol_lamports > 0 && self.fee_bps <= 100,
            ErrorCode::InvalidPolicy
        );
        require!(
            self.fee_shares == [7500, 1000, 500, 1000],
            ErrorCode::InvalidPolicy
        );
        for i in 0..3 {
            require!(
                self.fee_destinations[i] != Pubkey::default(),
                ErrorCode::InvalidPolicy
            );
            for j in 0..i {
                require_keys_neq!(
                    self.fee_destinations[i],
                    self.fee_destinations[j],
                    ErrorCode::InvalidPolicy
                );
            }
        }
        Ok(())
    }
}

#[account]
#[derive(InitSpace)]
pub struct Protocol {
    pub version: u8,
    pub admin: Pubkey,
    pub lever_mint: Pubkey,
    pub quote_mint: Pubkey,
    pub policy: ListingPolicy,
    pub paused: bool,
    pub bump: u8,
    pub total_burned: u64,
    pub listing_count: u64,
    pub initial_supply: u64,
    pub platform_revenue: u64,
    pub token_creator_revenue: u64,
}
#[account]
#[derive(InitSpace)]
pub struct Listing {
    pub protocol: Pubkey,
    pub lister: Pubkey,
    pub base_mint: Pubkey,
    pub base_vault: Pubkey,
    pub sol_lamports: u64,
    pub token_amount: u64,
    pub burned: u64,
    pub requested_at: i64,
    pub cancelled: bool,
    pub approved: bool,
    pub bump: u8,
}
#[account]
#[derive(InitSpace)]
pub struct MarginAccount {
    pub protocol: Pubkey,
    pub owner: Pubkey,
    pub vault: Pubkey,
    pub balance: u64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct AirdropCampaign {
    pub protocol: Pubkey,
    pub root: [u8; 32],
    pub total: u64,
    pub claimed: u64,
    pub starts_at: i64,
    pub ends_at: i64,
    pub reclaimed: bool,
    pub bump: u8,
}
#[account]
#[derive(InitSpace)]
pub struct AirdropClaim {
    pub campaign: Pubkey,
    pub owner: Pubkey,
    pub index: u64,
    pub amount: u64,
}

pub fn airdrop_leaf(campaign: Pubkey, owner: Pubkey, index: u64, amount: u64) -> [u8; 32] {
    solana_sha256_hasher::hashv(&[
        b"levermeme:airdrop:v1",
        campaign.as_ref(),
        owner.as_ref(),
        &index.to_le_bytes(),
        &amount.to_le_bytes(),
    ])
    .to_bytes()
}
pub fn verify_proof(mut leaf: [u8; 32], proof: &[[u8; 32]], root: [u8; 32]) -> bool {
    if proof.len() > 24 {
        return false;
    }
    for sibling in proof {
        let (left, right) = if leaf <= *sibling {
            (&leaf, sibling)
        } else {
            (sibling, &leaf)
        };
        leaf = solana_sha256_hasher::hashv(&[b"levermeme:node:v1", left, right]).to_bytes();
    }
    leaf == root
}

#[derive(Accounts)]
pub struct ReviewListing<'info> {
    pub admin: Signer<'info>,
    #[account(seeds = [b"protocol", protocol.admin.as_ref()], bump = protocol.bump, has_one = admin)]
    pub protocol: Box<Account<'info, Protocol>>,
    #[account(mut, seeds = [b"listing", protocol.key().as_ref(), listing.base_mint.as_ref()], bump = listing.bump, has_one = protocol)]
    pub listing: Box<Account<'info, Listing>>,
}
#[derive(Accounts)]
pub struct RoutePlatformRevenue<'info> {
    pub admin: Signer<'info>,
    #[account(mut,seeds=[b"protocol",protocol.admin.as_ref()],bump=protocol.bump,has_one=admin,has_one=quote_mint)]
    pub protocol: Box<Account<'info, Protocol>>,
    #[account(seeds=[b"listing",protocol.key().as_ref(),listing.base_mint.as_ref()],bump=listing.bump,has_one=protocol)]
    pub listing: Box<Account<'info, Listing>>,
    #[account(mint::token_program=quote_program)]
    pub quote_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(mut,token::mint=quote_mint,token::authority=admin,token::token_program=quote_program)]
    pub source: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut,token::mint=quote_mint,token::authority=protocol.policy.fee_destinations[0],token::token_program=quote_program)]
    pub treasury: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut,token::mint=quote_mint,token::authority=protocol.policy.fee_destinations[1],token::token_program=quote_program)]
    pub campaign_fund: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut,token::mint=quote_mint,token::authority=listing.lister,token::token_program=quote_program)]
    pub creator: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut,token::mint=quote_mint,token::authority=protocol.policy.fee_destinations[2],token::token_program=quote_program)]
    pub buyback_fund: Box<InterfaceAccount<'info, TokenAccount>>,
    pub quote_program: Interface<'info, TokenInterface>,
}
#[derive(Accounts)]
pub struct RouteTokenCreatorRevenue<'info> {
    pub admin: Signer<'info>,
    #[account(mut,seeds=[b"protocol",protocol.admin.as_ref()],bump=protocol.bump,has_one=admin,has_one=quote_mint)]
    pub protocol: Box<Account<'info, Protocol>>,
    #[account(mint::token_program=quote_program)]
    pub quote_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(mut,token::mint=quote_mint,token::authority=admin,token::token_program=quote_program)]
    pub source: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut,token::mint=quote_mint,token::authority=protocol.policy.fee_destinations[0],token::token_program=quote_program)]
    pub treasury: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut,token::mint=quote_mint,token::authority=protocol.policy.fee_destinations[2],token::token_program=quote_program)]
    pub buyback_fund: Box<InterfaceAccount<'info, TokenAccount>>,
    pub quote_program: Interface<'info, TokenInterface>,
}
#[derive(Accounts)]
pub struct CreateAirdrop<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(seeds = [b"protocol", protocol.admin.as_ref()], bump = protocol.bump, has_one = admin, has_one = lever_mint)]
    pub protocol: Box<Account<'info, Protocol>>,
    #[account(mint::token_program = lever_program)]
    pub lever_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(init, payer = admin, space = 8 + AirdropCampaign::INIT_SPACE, seeds = [b"airdrop", protocol.key().as_ref()], bump)]
    pub campaign: Box<Account<'info, AirdropCampaign>>,
    #[account(init, payer = admin, seeds = [b"airdrop-vault", campaign.key().as_ref()], bump,
        token::mint = lever_mint, token::authority = campaign, token::token_program = lever_program)]
    pub airdrop_vault: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut, token::mint = lever_mint, token::authority = admin, token::token_program = lever_program)]
    pub source: Box<InterfaceAccount<'info, TokenAccount>>,
    pub lever_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct ClaimAirdrop<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(seeds = [b"protocol", protocol.admin.as_ref()], bump = protocol.bump, has_one = lever_mint)]
    pub protocol: Box<Account<'info, Protocol>>,
    #[account(mut, seeds = [b"airdrop", protocol.key().as_ref()], bump = campaign.bump, has_one = protocol)]
    pub campaign: Box<Account<'info, AirdropCampaign>>,
    #[account(init, payer = owner, space = 8 + AirdropClaim::INIT_SPACE,
        seeds = [b"claim", campaign.key().as_ref(), owner.key().as_ref()], bump)]
    pub claim: Box<Account<'info, AirdropClaim>>,
    #[account(mint::token_program = lever_program)]
    pub lever_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(mut, seeds = [b"airdrop-vault", campaign.key().as_ref()], bump,
        token::mint = lever_mint, token::authority = campaign, token::token_program = lever_program)]
    pub airdrop_vault: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut, token::mint = lever_mint, token::authority = owner, token::token_program = lever_program)]
    pub destination: Box<InterfaceAccount<'info, TokenAccount>>,
    pub lever_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct ReclaimAirdrop<'info> {
    pub admin: Signer<'info>,
    #[account(seeds = [b"protocol", protocol.admin.as_ref()], bump = protocol.bump, has_one = admin, has_one = lever_mint)]
    pub protocol: Box<Account<'info, Protocol>>,
    #[account(mut, seeds = [b"airdrop", protocol.key().as_ref()], bump = campaign.bump, has_one = protocol)]
    pub campaign: Box<Account<'info, AirdropCampaign>>,
    #[account(mint::token_program = lever_program)]
    pub lever_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(mut, seeds = [b"airdrop-vault", campaign.key().as_ref()], bump,
        token::mint = lever_mint, token::authority = campaign, token::token_program = lever_program)]
    pub airdrop_vault: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut, token::mint = lever_mint, token::authority = admin, token::token_program = lever_program)]
    pub destination: Box<InterfaceAccount<'info, TokenAccount>>,
    pub lever_program: Interface<'info, TokenInterface>,
}

#[derive(Accounts)]
pub struct InitializeProtocol<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(init, payer = admin, space = 8 + Protocol::INIT_SPACE, seeds = [b"protocol", admin.key().as_ref()], bump)]
    pub protocol: Box<Account<'info, Protocol>>,
    pub lever_mint: Box<InterfaceAccount<'info, Mint>>,
    pub quote_mint: Box<InterfaceAccount<'info, Mint>>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct AdminProtocol<'info> {
    pub admin: Signer<'info>,
    #[account(mut, seeds = [b"protocol", protocol.admin.as_ref()], bump = protocol.bump, has_one = admin)]
    pub protocol: Box<Account<'info, Protocol>>,
}
#[derive(Accounts)]
pub struct RequestListing<'info> {
    #[account(mut)]
    pub lister: Signer<'info>,
    #[account(mut, seeds = [b"protocol", protocol.admin.as_ref()], bump = protocol.bump, has_one = lever_mint)]
    pub protocol: Box<Account<'info, Protocol>>,
    // Operator admission permit prevents an arbitrary first caller squatting
    // the permanent per-mint listing address. Both parties sign the exact burn
    // and funding transaction; the operator cannot move the lister's assets alone.
    #[account(address = protocol.admin)]
    pub reviewer: Signer<'info>,
    #[account(init, payer = lister, space = 8 + Listing::INIT_SPACE,
        seeds = [b"listing", protocol.key().as_ref(), base_mint.key().as_ref()], bump)]
    pub listing: Box<Account<'info, Listing>>,
    #[account(mint::token_program = base_program)]
    pub base_mint: Box<InterfaceAccount<'info, Mint>>,
    /// CHECK: Canonical pump.fun PDA, program owner and curve discriminator verified.
    #[account(seeds = [b"bonding-curve", base_mint.key().as_ref()], bump, seeds::program = PUMP_ID, owner = PUMP_ID)]
    pub pump_curve: UncheckedAccount<'info>,
    #[account(mut, mint::token_program = lever_program)]
    pub lever_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(mut, token::mint = lever_mint, token::authority = lister, token::token_program = lever_program)]
    pub lever_source: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut, token::mint = base_mint, token::authority = lister, token::token_program = base_program)]
    pub base_source: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(init, payer = lister, seeds = [b"base-vault", listing.key().as_ref()], bump,
        token::mint = base_mint, token::authority = listing, token::token_program = base_program)]
    pub base_vault: Box<InterfaceAccount<'info, TokenAccount>>,
    pub lever_program: Interface<'info, TokenInterface>,
    pub base_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CancelListing<'info> {
    #[account(mut)]
    pub lister: Signer<'info>,
    #[account(seeds = [b"protocol", protocol.admin.as_ref()], bump = protocol.bump)]
    pub protocol: Box<Account<'info, Protocol>>,
    #[account(mut, seeds = [b"listing", protocol.key().as_ref(), base_mint.key().as_ref()], bump = listing.bump,
        has_one = lister, has_one = protocol, has_one = base_mint, has_one = base_vault)]
    pub listing: Box<Account<'info, Listing>>,
    #[account(mint::token_program = base_program)]
    pub base_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(mut, seeds = [b"base-vault", listing.key().as_ref()], bump,
        token::mint = base_mint, token::authority = listing, token::token_program = base_program)]
    pub base_vault: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut, token::mint = base_mint, token::authority = lister, token::token_program = base_program)]
    pub base_destination: Box<InterfaceAccount<'info, TokenAccount>>,
    pub base_program: Interface<'info, TokenInterface>,
}
#[derive(Accounts)]
pub struct OpenMarginAccount<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(seeds = [b"protocol", protocol.admin.as_ref()], bump = protocol.bump, has_one = quote_mint)]
    pub protocol: Box<Account<'info, Protocol>>,
    #[account(mint::token_program = quote_program)]
    pub quote_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(init, payer = owner, space = 8 + MarginAccount::INIT_SPACE,
        seeds = [b"margin", protocol.key().as_ref(), owner.key().as_ref()], bump)]
    pub margin: Box<Account<'info, MarginAccount>>,
    #[account(init, payer = owner, seeds = [b"quote-vault", margin.key().as_ref()], bump,
        token::mint = quote_mint, token::authority = margin, token::token_program = quote_program)]
    pub quote_vault: Box<InterfaceAccount<'info, TokenAccount>>,
    pub quote_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct Deposit<'info> {
    pub owner: Signer<'info>,
    #[account(seeds = [b"protocol", protocol.admin.as_ref()], bump = protocol.bump, has_one = quote_mint)]
    pub protocol: Box<Account<'info, Protocol>>,
    #[account(mut, seeds = [b"margin", protocol.key().as_ref(), owner.key().as_ref()], bump = margin.bump,
        has_one = owner, has_one = protocol, constraint = margin.vault == quote_vault.key())]
    pub margin: Box<Account<'info, MarginAccount>>,
    #[account(mint::token_program = quote_program)]
    pub quote_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(mut, token::mint = quote_mint, token::authority = owner, token::token_program = quote_program)]
    pub source: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut, seeds = [b"quote-vault", margin.key().as_ref()], bump,
        token::mint = quote_mint, token::authority = margin, token::token_program = quote_program)]
    pub quote_vault: Box<InterfaceAccount<'info, TokenAccount>>,
    pub quote_program: Interface<'info, TokenInterface>,
}
#[derive(Accounts)]
pub struct Withdraw<'info> {
    pub owner: Signer<'info>,
    #[account(seeds = [b"protocol", protocol.admin.as_ref()], bump = protocol.bump, has_one = quote_mint)]
    pub protocol: Box<Account<'info, Protocol>>,
    #[account(mut, seeds = [b"margin", protocol.key().as_ref(), owner.key().as_ref()], bump = margin.bump,
        has_one = owner, has_one = protocol, constraint = margin.vault == quote_vault.key())]
    pub margin: Box<Account<'info, MarginAccount>>,
    #[account(mint::token_program = quote_program)]
    pub quote_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(mut, token::mint = quote_mint, token::authority = owner, token::token_program = quote_program)]
    pub destination: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut, seeds = [b"quote-vault", margin.key().as_ref()], bump,
        token::mint = quote_mint, token::authority = margin, token::token_program = quote_program)]
    pub quote_vault: Box<InterfaceAccount<'info, TokenAccount>>,
    pub quote_program: Interface<'info, TokenInterface>,
}

#[event]
pub struct ProtocolCreated {
    pub protocol: Pubkey,
    pub admin: Pubkey,
}
#[event]
pub struct PauseChanged {
    pub protocol: Pubkey,
    pub paused: bool,
}
#[event]
pub struct RevenueRouted {
    pub protocol: Pubkey,
    pub amount: u64,
    pub kind: u8,
    pub parts: [u64; 4],
}
#[event]
pub struct ListingRequested {
    pub listing: Pubkey,
    pub lister: Pubkey,
    pub base_mint: Pubkey,
    pub sol_lamports: u64,
    pub token_amount: u64,
    pub burned: u64,
}
#[event]
pub struct ListingCancelled {
    pub listing: Pubkey,
    pub lister: Pubkey,
}
#[event]
pub struct ListingReviewed {
    pub listing: Pubkey,
    pub approved: bool,
}
#[event]
pub struct AirdropCreated {
    pub campaign: Pubkey,
    pub total: u64,
    pub starts_at: i64,
    pub ends_at: i64,
}
#[event]
pub struct AirdropClaimed {
    pub campaign: Pubkey,
    pub owner: Pubkey,
    pub amount: u64,
}
#[event]
pub struct CollateralChanged {
    pub margin: Pubkey,
    pub owner: Pubkey,
    pub amount: u64,
    pub deposit: bool,
    pub balance: u64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("New listings and deposits are paused")]
    Paused,
    #[msg("The amount is zero or below the configured minimum")]
    InvalidAmount,
    #[msg("Arithmetic overflow")]
    Overflow,
    #[msg("Token mint is uninitialized, mintable or freezable")]
    UnsafeMint,
    #[msg("Token-2022 extension is not supported for custody")]
    UnsafeExtension,
    #[msg("Base, quote and burn mints must be distinct")]
    SameMint,
    #[msg("The coin is not a verified pump.fun mint")]
    NotPump,
    #[msg("Token transfer amount does not match the received balance")]
    TransferDelta,
    #[msg("Listing was already cancelled")]
    AlreadyCancelled,
    #[msg("Insufficient available balance")]
    InsufficientFunds,
    #[msg("Invalid listing or fee policy")]
    InvalidPolicy,
    #[msg("Market listing has not been approved, or was cancelled")]
    NotApproved,
    #[msg("Invalid campaign timing, root or proof length")]
    InvalidCampaign,
    #[msg("Airdrop has not started, has expired, or was reclaimed")]
    CampaignClosed,
    #[msg("Airdrop proof does not match this campaign, wallet, index and amount")]
    InvalidProof,
}

#[cfg(test)]
mod admission_tests {
    use super::*;
    #[test]
    fn leaves_bind_campaign_wallet_index_and_amount() {
        let campaign = Pubkey::new_from_array([7; 32]);
        let owner = Pubkey::new_from_array([8; 32]);
        let leaf = airdrop_leaf(campaign, owner, 1, 100);
        assert!(verify_proof(leaf, &[], leaf));
        assert!(!verify_proof(
            airdrop_leaf(campaign, owner, 2, 100),
            &[],
            leaf
        ));
        assert!(!verify_proof(
            airdrop_leaf(campaign, owner, 1, 101),
            &[],
            leaf
        ));
        assert!(!verify_proof(airdrop_leaf(owner, owner, 1, 100), &[], leaf));
        assert!(!verify_proof(
            airdrop_leaf(campaign, campaign, 1, 100),
            &[],
            leaf
        ));
        assert!(!verify_proof(leaf, &[[0; 32]; 25], leaf));
    }
    #[test]
    fn sorted_merkle_branch_and_domain_separation() {
        let a = [1; 32];
        let b = [2; 32];
        let root = solana_sha256_hasher::hashv(&[b"levermeme:node:v1", &a, &b]).to_bytes();
        assert!(verify_proof(a, &[b], root));
        assert!(verify_proof(b, &[a], root));
        assert!(!verify_proof(a, &[[3; 32]], root));
    }
    #[test]
    fn leaf_matches_generated_javascript_manifest() {
        assert_eq!(
            airdrop_leaf(
                Pubkey::new_from_array([4; 32]),
                Pubkey::new_from_array([1; 32]),
                0,
                10
            ),
            [
                34, 180, 176, 111, 125, 226, 105, 141, 114, 40, 81, 99, 75, 199, 216, 167, 208,
                192, 255, 75, 116, 2, 225, 19, 97, 225, 1, 235, 145, 207, 191, 143
            ]
        );
    }
    #[test]
    fn admission_policy_cannot_silently_change_the_split() {
        let mut policy = ListingPolicy {
            burn_amount: 1,
            min_sol_lamports: 1,
            fee_bps: 100,
            fee_shares: [7500, 1000, 500, 1000],
            fee_destinations: [
                Pubkey::new_from_array([1; 32]),
                Pubkey::new_from_array([2; 32]),
                Pubkey::new_from_array([3; 32]),
            ],
        };
        assert!(policy.validate().is_ok());
        policy.fee_shares = [2500; 4];
        assert!(policy.validate().is_err());
        policy.fee_shares = [7500, 1000, 500, 1000];
        policy.burn_amount = 0;
        assert!(policy.validate().is_err());
    }
}
