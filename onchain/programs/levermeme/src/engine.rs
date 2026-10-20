//! Isolated, fully-reserved, profit-capped long/short markets.
//! Quote collateral is xSOL; admission SOL/base escrow is not counted as capital.
use crate::{math, validate_mint, Listing, MarginAccount, Protocol};
use anchor_lang::prelude::*;
use anchor_spl::token_interface::{self, Mint, TokenAccount, TokenInterface, TransferChecked};
use switchboard_on_demand::QuoteVerifier;

pub const QUOTE_PROGRAM: Pubkey = pubkey!("orac1eFjzWL5R3RbbdMV68K9H6TaCVVcL6LjvQQWAbz");
pub const SWITCHBOARD_PROGRAM: Pubkey = pubkey!("SBondMDrcV3K4kxZR1HNVT7osZxAHVHgYXL5Ze1oMUv");
pub const PRICE_SCALE: u64 = 1_000_000_000_000;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub struct MarketRisk {
    pub feed_hash: [u8; 32], // immutable reviewed base/xSOL price job
    pub twap_hash: [u8; 32], // independent time-weighted base/xSOL job
    pub queue: Pubkey,
    pub max_price_age_slots: u64,
    pub max_twap_deviation_bps: u16,
    pub min_oracles: u8,
    pub max_leverage: u8,
    pub maintenance_bps: u16,
    pub liquidation_bps: u16,
    pub spread_bps: u16,
    pub max_profit_bps: u32, // % of original margin, capped at notional
    pub max_open_interest: u64,
    pub max_position_notional: u64,
    pub minimum_margin: u64,
    pub minimum_liquidity: u64,
    pub emergency_delay_seconds: i64,
}
impl MarketRisk {
    pub fn validate(&self, fee_bps: u16) -> Result<()> {
        require!(
            self.feed_hash != [0; 32]
                && self.twap_hash != [0; 32]
                && self.feed_hash != self.twap_hash
                && self.queue != Pubkey::default(),
            EngineError::Risk
        );
        require!(
            (1..=10).contains(&self.max_leverage)
                && (1..=20).contains(&self.max_price_age_slots)
                && (3..=4).contains(&self.min_oracles)
                && (1..=1000).contains(&self.max_twap_deviation_bps)
                && (5..=100).contains(&self.spread_bps)
                && (1..=500).contains(&self.maintenance_bps)
                && self.liquidation_bps <= 100
                && (1000..=100000).contains(&self.max_profit_bps)
                && self.max_open_interest >= self.max_position_notional
                && self.max_position_notional > 0
                && self.minimum_margin > 0
                && self.minimum_liquidity > 0
                && (3600..=86400).contains(&self.emergency_delay_seconds),
            EngineError::Risk
        );
        let costs = u32::from(self.maintenance_bps)
            .checked_add(u32::from(self.liquidation_bps))
            .and_then(|n| n.checked_add(u32::from(fee_bps)))
            .and_then(|n| n.checked_add(u32::from(self.spread_bps).checked_mul(2)?))
            .ok_or(EngineError::Math)?;
        require!(
            costs
                .checked_mul(u32::from(self.max_leverage))
                .ok_or(EngineError::Math)?
                < 10000,
            EngineError::Risk
        );
        Ok(())
    }
}
#[account]
#[derive(InitSpace)]
pub struct Market {
    pub protocol: Pubkey,
    pub listing: Pubkey,
    pub lister: Pubkey,
    pub quote_mint: Pubkey,
    pub quote_vault: Pubkey,
    pub risk: MarketRisk,
    pub enabled: bool,
    pub closed: bool,
    pub bump: u8,
    pub liquidity: u64,
    pub reserved_profit: u64,
    pub total_margin: u64,
    pub open_interest: u64,
    pub accrued_fees: u64,
    pub price: u64,
    pub twap: u64,
    pub price_slot: u64,
    pub price_timestamp: i64,
}
#[account]
#[derive(InitSpace)]
pub struct Position {
    pub market: Pubkey,
    pub margin_account: Pubkey,
    pub owner: Pubkey,
    pub id: u64,
    pub long: bool,
    pub collateral: u64,
    pub notional: u64,
    pub entry_price: u64,
    pub reserved_profit: u64,
    pub opened_slot: u64,
    pub closed: bool,
    pub exit_price: u64,
    pub payout: u64,
    pub reason: u8, // 0 owner, 1 liquidation, 2 profit cap, 3 oracle outage
}
fn add(a: u64, b: u64) -> Result<u64> {
    a.checked_add(b).ok_or_else(|| error!(EngineError::Math))
}
fn sub(a: u64, b: u64) -> Result<u64> {
    a.checked_sub(b).ok_or_else(|| error!(EngineError::Funds))
}
fn fee(n: u64, bps: u16) -> Result<u64> {
    math::fee_ceil(n, bps).ok_or_else(|| error!(EngineError::Math))
}
fn spread(price: u64, bps: u16, up: bool) -> Result<u64> {
    let shift = fee(price, bps)?;
    if up {
        add(price, shift)
    } else {
        Ok(sub(price, shift)?.max(1))
    }
}
pub fn equity(position: &Position, mark: u64) -> Result<u64> {
    let pnl = math::pnl(position.notional, position.entry_price, mark, position.long)
        .ok_or(EngineError::Math)?;
    let gross = i128::from(position.collateral)
        .checked_add(pnl)
        .ok_or(EngineError::Math)?;
    let maximum = add(position.collateral, position.reserved_profit)?;
    Ok(u64::try_from(gross.max(0).min(i128::from(maximum))).map_err(|_| EngineError::Math)?)
}
pub fn check_invariant(market: &Market, vault_amount: u64) -> Result<()> {
    require!(
        market.reserved_profit <= market.liquidity,
        EngineError::Funds
    );
    require!(
        vault_amount
            >= add(
                add(market.liquidity, market.total_margin)?,
                market.accrued_fees
            )?,
        EngineError::Funds
    );
    Ok(())
}
fn transfer<'info>(
    program: Pubkey,
    mint: AccountInfo<'info>,
    from: AccountInfo<'info>,
    to: AccountInfo<'info>,
    authority: AccountInfo<'info>,
    amount: u64,
    decimals: u8,
    seeds: &[&[u8]],
) -> Result<()> {
    require_keys_neq!(from.key(), to.key(), EngineError::Risk);
    if amount == 0 {
        return Ok(());
    }
    let accounts = TransferChecked {
        from,
        mint,
        to,
        authority,
    };
    if seeds.is_empty() {
        token_interface::transfer_checked(CpiContext::new(program, accounts), amount, decimals)
    } else {
        token_interface::transfer_checked(
            CpiContext::new_with_signer(program, accounts, &[seeds]),
            amount,
            decimals,
        )
    }
}
pub fn create(ctx: Context<CreateMarket>, risk: MarketRisk) -> Result<()> {
    risk.validate(ctx.accounts.protocol.policy.fee_bps)?;
    validate_mint(&ctx.accounts.quote_mint)?;
    require!(
        ctx.accounts.listing.approved
            && !ctx.accounts.listing.cancelled
            && !ctx.accounts.listing.market_initialized,
        EngineError::Admission
    );
    let market = &mut ctx.accounts.market;
    market.protocol = ctx.accounts.protocol.key();
    market.listing = ctx.accounts.listing.key();
    market.lister = ctx.accounts.listing.lister;
    market.quote_mint = ctx.accounts.quote_mint.key();
    market.quote_vault = ctx.accounts.market_vault.key();
    market.risk = risk;
    market.bump = ctx.bumps.market;
    market.enabled = false;
    market.closed = false;
    ctx.accounts.listing.market_initialized = true;
    Ok(())
}
pub fn fund(ctx: Context<MarketLiquidity>, amount: u64) -> Result<()> {
    require!(
        amount > 0 && !ctx.accounts.market.closed,
        EngineError::Amount
    );
    validate_mint(&ctx.accounts.quote_mint)?;
    let before = ctx.accounts.market_vault.amount;
    transfer(
        ctx.accounts.quote_program.key(),
        ctx.accounts.quote_mint.to_account_info(),
        ctx.accounts.lister_tokens.to_account_info(),
        ctx.accounts.market_vault.to_account_info(),
        ctx.accounts.lister.to_account_info(),
        amount,
        ctx.accounts.quote_mint.decimals,
        &[],
    )?;
    ctx.accounts.market_vault.reload()?;
    require!(
        ctx.accounts.market_vault.amount.checked_sub(before) == Some(amount),
        EngineError::Funds
    );
    ctx.accounts.market.liquidity = add(ctx.accounts.market.liquidity, amount)?;
    check_invariant(&ctx.accounts.market, ctx.accounts.market_vault.amount)
}
pub fn withdraw_liquidity(ctx: Context<MarketLiquidity>, amount: u64) -> Result<()> {
    require!(amount > 0, EngineError::Amount);
    let market = &mut ctx.accounts.market;
    let remaining = sub(market.liquidity, amount)?;
    require!(remaining >= market.reserved_profit, EngineError::Reserved);
    let listing = market.listing;
    let bump = [market.bump];
    let seeds: &[&[u8]] = &[b"market", listing.as_ref(), &bump];
    transfer(
        ctx.accounts.quote_program.key(),
        ctx.accounts.quote_mint.to_account_info(),
        ctx.accounts.market_vault.to_account_info(),
        ctx.accounts.lister_tokens.to_account_info(),
        market.to_account_info(),
        amount,
        ctx.accounts.quote_mint.decimals,
        seeds,
    )?;
    market.liquidity = remaining;
    ctx.accounts.market_vault.reload()?;
    check_invariant(market, ctx.accounts.market_vault.amount)
}
pub fn set_enabled(ctx: Context<ManageMarket>, enabled: bool) -> Result<()> {
    require!(!ctx.accounts.market.closed, EngineError::Closed);
    if enabled {
        require!(
            !ctx.accounts.protocol.paused
                && ctx.accounts.listing.approved
                && !ctx.accounts.listing.cancelled,
            EngineError::Admission
        );
        fresh(&ctx.accounts.market, false)?;
        require!(
            ctx.accounts.market.liquidity >= ctx.accounts.market.risk.minimum_liquidity,
            EngineError::Funds
        );
    }
    ctx.accounts.market.enabled = enabled;
    Ok(())
}
pub fn retire(ctx: Context<ManageMarket>) -> Result<()> {
    require!(
        !ctx.accounts.market.enabled
            && ctx.accounts.market.open_interest == 0
            && ctx.accounts.market.total_margin == 0
            && ctx.accounts.market.liquidity == 0
            && ctx.accounts.market.accrued_fees == 0,
        EngineError::Reserved
    );
    ctx.accounts.market.closed = true;
    ctx.accounts.listing.market_initialized = false;
    ctx.accounts.listing.approved = false;
    Ok(())
}
pub fn refresh<'info>(ctx: Context<'info, RefreshMarketPrice<'info>>) -> Result<()> {
    let market = &mut ctx.accounts.market;
    require!(!market.closed, EngineError::Closed);
    let clock = Clock::get()?;
    let queue = ctx.accounts.queue.to_account_info();
    let slots = ctx.accounts.slot_hashes.to_account_info();
    let instructions = ctx.accounts.instructions.to_account_info();
    let mut verifier = QuoteVerifier::new();
    verifier
        .queue(&queue)
        .slothash_sysvar(&slots)
        .ix_sysvar(&instructions)
        .clock_slot(clock.slot)
        .max_age(market.risk.max_price_age_slots);
    let quote = verifier
        .verify_account(&market.risk.queue.to_bytes(), ctx.accounts.oracle.as_ref())
        .map_err(|_| EngineError::Oracle)?;
    require!(
        quote.oracle_count >= market.risk.min_oracles && quote.slot() >= market.price_slot,
        EngineError::Oracle
    );
    require!(
        quote.oracle_idxs.len() >= usize::from(quote.oracle_count),
        EngineError::Oracle
    );
    let mut seen = [false; 30];
    for index in quote
        .oracle_idxs
        .iter()
        .take(usize::from(quote.oracle_count))
    {
        let i = usize::from(*index);
        require!(i < 30 && !seen[i], EngineError::Oracle);
        seen[i] = true;
    }
    let spot = quote
        .feed(&market.risk.feed_hash)
        .map_err(|_| EngineError::Oracle)?;
    let reference = quote
        .feed(&market.risk.twap_hash)
        .map_err(|_| EngineError::Oracle)?;
    require!(
        spot.min_oracle_samples() >= market.risk.min_oracles
            && reference.min_oracle_samples() >= market.risk.min_oracles
            && spot.min_oracle_samples() <= quote.oracle_count
            && reference.min_oracle_samples() <= quote.oracle_count,
        EngineError::Oracle
    );
    let price = u64::try_from(spot.feed_value() / 1_000_000).map_err(|_| EngineError::Oracle)?;
    let twap =
        u64::try_from(reference.feed_value() / 1_000_000).map_err(|_| EngineError::Oracle)?;
    require!(price > 0 && twap > 0, EngineError::Oracle);
    let deviation = u128::from(price.abs_diff(twap))
        .checked_mul(10000)
        .ok_or(EngineError::Math)?;
    let allowed = u128::from(twap)
        .checked_mul(u128::from(market.risk.max_twap_deviation_bps))
        .ok_or(EngineError::Math)?;
    require!(deviation <= allowed, EngineError::Deviation);
    market.price = price;
    market.twap = twap;
    market.price_slot = quote.slot();
    market.price_timestamp = clock.unix_timestamp;
    emit!(PriceRefreshed {
        market: market.key(),
        price,
        slot: quote.slot()
    });
    Ok(())
}
fn fresh(market: &Market, emergency: bool) -> Result<()> {
    let clock = Clock::get()?;
    require!(
        market.price > 0 && market.price_slot <= clock.slot,
        EngineError::Oracle
    );
    if emergency {
        let age = clock
            .unix_timestamp
            .checked_sub(market.price_timestamp)
            .ok_or(EngineError::Math)?;
        require!(
            age >= market.risk.emergency_delay_seconds,
            EngineError::Stale
        );
    } else {
        require!(
            clock
                .slot
                .checked_sub(market.price_slot)
                .ok_or(EngineError::Math)?
                <= market.risk.max_price_age_slots,
            EngineError::Stale
        );
    }
    Ok(())
}
pub fn open(
    ctx: Context<OpenPosition>,
    id: u64,
    collateral: u64,
    leverage: u8,
    long: bool,
    expected_price: u64,
    slippage_bps: u16,
) -> Result<()> {
    let market = &mut ctx.accounts.market;
    require!(
        !ctx.accounts.protocol.paused
            && market.enabled
            && !market.closed
            && ctx.accounts.listing.approved
            && !ctx.accounts.listing.cancelled,
        EngineError::Closed
    );
    require!(
        collateral >= market.risk.minimum_margin
            && (1..=market.risk.max_leverage).contains(&leverage)
            && slippage_bps <= 100,
        EngineError::Amount
    );
    require!(
        id == ctx.accounts.margin.next_position_id,
        EngineError::Replay
    );
    validate_mint(&ctx.accounts.quote_mint)?;
    fresh(market, false)?;
    let notional = math::notional(collateral, leverage).ok_or(EngineError::Math)?;
    require!(
        notional <= market.risk.max_position_notional
            && add(market.open_interest, notional)? <= market.risk.max_open_interest,
        EngineError::Exposure
    );
    require!(
        market.liquidity >= market.risk.minimum_liquidity,
        EngineError::Funds
    );
    let entry = spread(market.price, market.risk.spread_bps, long)?;
    check_slippage(entry, expected_price, slippage_bps)?;
    let profit = u64::try_from(
        u128::from(collateral)
            .checked_mul(u128::from(market.risk.max_profit_bps))
            .ok_or(EngineError::Math)?
            / 10000,
    )
    .map_err(|_| EngineError::Math)?
    .min(notional);
    require!(
        profit > 0 && add(market.reserved_profit, profit)? <= market.liquidity,
        EngineError::Reserved
    );
    let opening_fee = fee(notional, ctx.accounts.protocol.policy.fee_bps)?;
    let debit = add(collateral, opening_fee)?;
    let available = sub(ctx.accounts.margin.balance, debit)?;
    let protocol = ctx.accounts.protocol.key();
    let owner = ctx.accounts.owner.key();
    let bump = [ctx.accounts.margin.bump];
    let seeds: &[&[u8]] = &[b"margin", protocol.as_ref(), owner.as_ref(), &bump];
    transfer(
        ctx.accounts.quote_program.key(),
        ctx.accounts.quote_mint.to_account_info(),
        ctx.accounts.user_vault.to_account_info(),
        ctx.accounts.market_vault.to_account_info(),
        ctx.accounts.margin.to_account_info(),
        debit,
        ctx.accounts.quote_mint.decimals,
        seeds,
    )?;
    ctx.accounts.margin.balance = available;
    ctx.accounts.margin.locked = add(ctx.accounts.margin.locked, collateral)?;
    ctx.accounts.margin.next_position_id = add(id, 1)?;
    market.total_margin = add(market.total_margin, collateral)?;
    market.open_interest = add(market.open_interest, notional)?;
    market.reserved_profit = add(market.reserved_profit, profit)?;
    market.accrued_fees = add(market.accrued_fees, opening_fee)?;
    let p = &mut ctx.accounts.position;
    p.market = market.key();
    p.margin_account = ctx.accounts.margin.key();
    p.owner = owner;
    p.id = id;
    p.long = long;
    p.collateral = collateral;
    p.notional = notional;
    p.entry_price = entry;
    p.reserved_profit = profit;
    p.opened_slot = Clock::get()?.slot;
    p.closed = false;
    let initial_equity = equity(p, spread(market.price, market.risk.spread_bps, !long)?)?;
    let maintenance = add(
        add(
            fee(notional, market.risk.maintenance_bps)?,
            fee(notional, ctx.accounts.protocol.policy.fee_bps)?,
        )?,
        fee(notional, market.risk.liquidation_bps)?,
    )?;
    require!(initial_equity > maintenance, EngineError::Risk);
    ctx.accounts.market_vault.reload()?;
    check_invariant(market, ctx.accounts.market_vault.amount)?;
    emit!(PositionOpened {
        position: p.key(),
        owner,
        market: market.key(),
        notional,
        collateral,
        entry_price: entry,
        max_profit: profit,
        long
    });
    Ok(())
}
fn check_slippage(price: u64, expected: u64, bps: u16) -> Result<()> {
    require!(expected > 0 && bps <= 100, EngineError::Slippage);
    require!(
        u128::from(price.abs_diff(expected))
            .checked_mul(10000)
            .ok_or(EngineError::Math)?
            <= u128::from(expected)
                .checked_mul(u128::from(bps))
                .ok_or(EngineError::Math)?,
        EngineError::Slippage
    );
    Ok(())
}
/// reason=0 owner close, 1 unhealthy position, 2 capped-profit settlement,
/// 3 permissionless settlement at the last verified mark after a feed outage.
pub fn settle(
    ctx: Context<SettlePosition>,
    reason: u8,
    expected_price: u64,
    slippage_bps: u16,
) -> Result<()> {
    let market = &mut ctx.accounts.market;
    let p = &mut ctx.accounts.position;
    require!(!p.closed && reason <= 3, EngineError::Closed);
    fresh(market, reason == 3)?;
    let exit = spread(market.price, market.risk.spread_bps, !p.long)?;
    if reason == 0 {
        require_keys_eq!(ctx.accounts.actor.key(), p.owner, EngineError::Owner);
        check_slippage(exit, expected_price, slippage_bps)?;
    }
    let gross = equity(p, exit)?;
    let closing_fee = fee(p.notional, ctx.accounts.protocol.policy.fee_bps)?.min(gross);
    let bounty = if reason == 1 {
        fee(p.notional, market.risk.liquidation_bps)?.min(sub(gross, closing_fee)?)
    } else {
        0
    };
    if reason == 1 {
        let threshold = add(
            add(
                fee(p.notional, market.risk.maintenance_bps)?,
                fee(p.notional, ctx.accounts.protocol.policy.fee_bps)?,
            )?,
            fee(p.notional, market.risk.liquidation_bps)?,
        )?;
        require!(gross <= threshold, EngineError::Healthy);
    }
    if reason == 2 {
        require!(
            gross == add(p.collateral, p.reserved_profit)?,
            EngineError::Healthy
        );
    }
    require!(
        market.price_slot >= p.opened_slot || reason == 3,
        EngineError::Oracle
    );
    let payout = sub(sub(gross, closing_fee)?, bounty)?;
    let listing = market.listing;
    let bump = [market.bump];
    let seeds: &[&[u8]] = &[b"market", listing.as_ref(), &bump];
    transfer(
        ctx.accounts.quote_program.key(),
        ctx.accounts.quote_mint.to_account_info(),
        ctx.accounts.market_vault.to_account_info(),
        ctx.accounts.user_vault.to_account_info(),
        market.to_account_info(),
        payout,
        ctx.accounts.quote_mint.decimals,
        seeds,
    )?;
    if bounty > 0 {
        transfer(
            ctx.accounts.quote_program.key(),
            ctx.accounts.quote_mint.to_account_info(),
            ctx.accounts.market_vault.to_account_info(),
            ctx.accounts.actor_tokens.to_account_info(),
            market.to_account_info(),
            bounty,
            ctx.accounts.quote_mint.decimals,
            seeds,
        )?;
    }
    market.liquidity = sub(add(market.liquidity, p.collateral)?, gross)?;
    market.reserved_profit = sub(market.reserved_profit, p.reserved_profit)?;
    market.total_margin = sub(market.total_margin, p.collateral)?;
    market.open_interest = sub(market.open_interest, p.notional)?;
    market.accrued_fees = add(market.accrued_fees, closing_fee)?;
    ctx.accounts.margin.locked = sub(ctx.accounts.margin.locked, p.collateral)?;
    ctx.accounts.margin.balance = add(ctx.accounts.margin.balance, payout)?;
    p.closed = true;
    p.exit_price = exit;
    p.payout = payout;
    p.reason = reason;
    ctx.accounts.market_vault.reload()?;
    check_invariant(market, ctx.accounts.market_vault.amount)?;
    emit!(PositionSettled {
        position: p.key(),
        owner: p.owner,
        market: market.key(),
        payout,
        fee: closing_fee,
        bounty,
        exit_price: exit,
        reason
    });
    Ok(())
}
pub fn collect(ctx: Context<CollectMarketFees>) -> Result<()> {
    let market = &mut ctx.accounts.market;
    let amount = market.accrued_fees;
    require!(amount > 0, EngineError::Amount);
    let parts = math::split_fee(amount, ctx.accounts.protocol.policy.fee_shares)
        .ok_or(EngineError::Math)?;
    let listing = market.listing;
    let bump = [market.bump];
    let seeds: &[&[u8]] = &[b"market", listing.as_ref(), &bump];
    for (to, n) in [
        ctx.accounts.treasury.to_account_info(),
        ctx.accounts.campaign_fund.to_account_info(),
        ctx.accounts.creator.to_account_info(),
        ctx.accounts.buyback_fund.to_account_info(),
    ]
    .into_iter()
    .zip(parts)
    {
        transfer(
            ctx.accounts.quote_program.key(),
            ctx.accounts.quote_mint.to_account_info(),
            ctx.accounts.market_vault.to_account_info(),
            to,
            market.to_account_info(),
            n,
            ctx.accounts.quote_mint.decimals,
            seeds,
        )?;
    }
    market.accrued_fees = 0;
    ctx.accounts.protocol.platform_revenue = add(ctx.accounts.protocol.platform_revenue, amount)?;
    ctx.accounts.market_vault.reload()?;
    check_invariant(market, ctx.accounts.market_vault.amount)?;
    emit!(crate::RevenueRouted {
        protocol: ctx.accounts.protocol.key(),
        amount,
        kind: 0,
        parts
    });
    Ok(())
}

#[derive(Accounts)]
pub struct CreateMarket<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(seeds=[b"protocol",admin.key().as_ref()],bump=protocol.bump,has_one=admin,has_one=quote_mint)]
    pub protocol: Box<Account<'info, Protocol>>,
    #[account(mut,seeds=[b"listing",protocol.key().as_ref(),listing.base_mint.as_ref()],bump=listing.bump,has_one=protocol)]
    pub listing: Box<Account<'info, Listing>>,
    #[account(init,payer=admin,space=8+Market::INIT_SPACE,seeds=[b"market",listing.key().as_ref()],bump)]
    pub market: Box<Account<'info, Market>>,
    #[account(mint::token_program=quote_program)]
    pub quote_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(init,payer=admin,seeds=[b"market-vault",market.key().as_ref()],bump,token::mint=quote_mint,token::authority=market,token::token_program=quote_program)]
    pub market_vault: Box<InterfaceAccount<'info, TokenAccount>>,
    pub quote_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct MarketLiquidity<'info> {
    pub lister: Signer<'info>,
    #[account(seeds=[b"protocol",protocol.admin.as_ref()],bump=protocol.bump,has_one=quote_mint)]
    pub protocol: Box<Account<'info, Protocol>>,
    #[account(mut,seeds=[b"market",market.listing.as_ref()],bump=market.bump,has_one=protocol,has_one=lister,has_one=quote_mint,constraint=market.quote_vault==market_vault.key())]
    pub market: Box<Account<'info, Market>>,
    #[account(mint::token_program=quote_program)]
    pub quote_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(mut,seeds=[b"market-vault",market.key().as_ref()],bump,token::mint=quote_mint,token::authority=market,token::token_program=quote_program)]
    pub market_vault: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut,token::mint=quote_mint,token::authority=lister,token::token_program=quote_program)]
    pub lister_tokens: Box<InterfaceAccount<'info, TokenAccount>>,
    pub quote_program: Interface<'info, TokenInterface>,
}
#[derive(Accounts)]
pub struct ManageMarket<'info> {
    pub admin: Signer<'info>,
    #[account(seeds=[b"protocol",admin.key().as_ref()],bump=protocol.bump,has_one=admin)]
    pub protocol: Box<Account<'info, Protocol>>,
    #[account(mut,seeds=[b"listing",protocol.key().as_ref(),listing.base_mint.as_ref()],bump=listing.bump,has_one=protocol)]
    pub listing: Box<Account<'info, Listing>>,
    #[account(mut,seeds=[b"market",listing.key().as_ref()],bump=market.bump,has_one=protocol,has_one=listing)]
    pub market: Box<Account<'info, Market>>,
}
#[derive(Accounts)]
pub struct RefreshMarketPrice<'info> {
    #[account(seeds=[b"protocol",protocol.admin.as_ref()],bump=protocol.bump)]
    pub protocol: Box<Account<'info, Protocol>>,
    #[account(mut,seeds=[b"market",market.listing.as_ref()],bump=market.bump,has_one=protocol)]
    pub market: Box<Account<'info, Market>>,
    /// CHECK: Pinned approved queue, canonical Switchboard owner; SDK validates signatures.
    #[account(address=market.risk.queue,owner=SWITCHBOARD_PROGRAM)]
    pub queue: UncheckedAccount<'info>,
    /// CHECK: Only the verified quote program may write this account; SDK validates namespace, signatures, feeds and age.
    #[account(owner=QUOTE_PROGRAM)]
    pub oracle: UncheckedAccount<'info>,
    /// CHECK: Canonical sysvar address, consumed by Switchboard verifier.
    #[account(address=pubkey!("SysvarS1otHashes111111111111111111111111111"))]
    pub slot_hashes: UncheckedAccount<'info>,
    /// CHECK: Canonical instructions sysvar, consumed by Switchboard verifier.
    #[account(address=pubkey!("Sysvar1nstructions1111111111111111111111111"))]
    pub instructions: UncheckedAccount<'info>,
}
#[derive(Accounts)]
#[instruction(id:u64)]
pub struct OpenPosition<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(seeds=[b"protocol",protocol.admin.as_ref()],bump=protocol.bump,has_one=quote_mint)]
    pub protocol: Box<Account<'info, Protocol>>,
    #[account(seeds=[b"listing",protocol.key().as_ref(),listing.base_mint.as_ref()],bump=listing.bump,has_one=protocol)]
    pub listing: Box<Account<'info, Listing>>,
    #[account(mut,seeds=[b"market",listing.key().as_ref()],bump=market.bump,has_one=protocol,has_one=listing,has_one=quote_mint)]
    pub market: Box<Account<'info, Market>>,
    #[account(mut,seeds=[b"margin",protocol.key().as_ref(),owner.key().as_ref()],bump=margin.bump,has_one=protocol,has_one=owner,constraint=margin.vault==user_vault.key())]
    pub margin: Box<Account<'info, MarginAccount>>,
    #[account(init,payer=owner,space=8+Position::INIT_SPACE,seeds=[b"position",margin.key().as_ref(),&id.to_le_bytes()],bump)]
    pub position: Box<Account<'info, Position>>,
    #[account(mint::token_program=quote_program)]
    pub quote_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(mut,seeds=[b"quote-vault",margin.key().as_ref()],bump,token::mint=quote_mint,token::authority=margin,token::token_program=quote_program)]
    pub user_vault: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut,seeds=[b"market-vault",market.key().as_ref()],bump,token::mint=quote_mint,token::authority=market,token::token_program=quote_program)]
    pub market_vault: Box<InterfaceAccount<'info, TokenAccount>>,
    pub quote_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct SettlePosition<'info> {
    pub actor: Signer<'info>,
    #[account(seeds=[b"protocol",protocol.admin.as_ref()],bump=protocol.bump,has_one=quote_mint)]
    pub protocol: Box<Account<'info, Protocol>>,
    #[account(mut,seeds=[b"market",market.listing.as_ref()],bump=market.bump,has_one=protocol,has_one=quote_mint)]
    pub market: Box<Account<'info, Market>>,
    #[account(mut,seeds=[b"margin",protocol.key().as_ref(),margin.owner.as_ref()],bump=margin.bump,has_one=protocol,constraint=margin.vault==user_vault.key())]
    pub margin: Box<Account<'info, MarginAccount>>,
    #[account(mut,seeds=[b"position",margin.key().as_ref(),&position.id.to_le_bytes()],bump,has_one=market,constraint=position.margin_account==margin.key(),constraint=position.owner==margin.owner)]
    pub position: Box<Account<'info, Position>>,
    #[account(mint::token_program=quote_program)]
    pub quote_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(mut,seeds=[b"quote-vault",margin.key().as_ref()],bump,token::mint=quote_mint,token::authority=margin,token::token_program=quote_program)]
    pub user_vault: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut,seeds=[b"market-vault",market.key().as_ref()],bump,token::mint=quote_mint,token::authority=market,token::token_program=quote_program)]
    pub market_vault: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut,token::mint=quote_mint,token::authority=actor,token::token_program=quote_program)]
    pub actor_tokens: Box<InterfaceAccount<'info, TokenAccount>>,
    pub quote_program: Interface<'info, TokenInterface>,
}
#[derive(Accounts)]
pub struct CollectMarketFees<'info> {
    #[account(mut,seeds=[b"protocol",protocol.admin.as_ref()],bump=protocol.bump,has_one=quote_mint)]
    pub protocol: Box<Account<'info, Protocol>>,
    #[account(seeds=[b"listing",protocol.key().as_ref(),listing.base_mint.as_ref()],bump=listing.bump,has_one=protocol)]
    pub listing: Box<Account<'info, Listing>>,
    #[account(mut,seeds=[b"market",listing.key().as_ref()],bump=market.bump,has_one=protocol,has_one=listing,has_one=quote_mint)]
    pub market: Box<Account<'info, Market>>,
    #[account(mint::token_program=quote_program)]
    pub quote_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(mut,seeds=[b"market-vault",market.key().as_ref()],bump,token::mint=quote_mint,token::authority=market,token::token_program=quote_program)]
    pub market_vault: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut,dup,token::mint=quote_mint,token::authority=protocol.policy.fee_destinations[0],token::token_program=quote_program)]
    pub treasury: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut,dup,token::mint=quote_mint,token::authority=protocol.policy.fee_destinations[1],token::token_program=quote_program)]
    pub campaign_fund: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut,dup,token::mint=quote_mint,token::authority=listing.lister,token::token_program=quote_program)]
    pub creator: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut,dup,token::mint=quote_mint,token::authority=protocol.policy.fee_destinations[2],token::token_program=quote_program)]
    pub buyback_fund: Box<InterfaceAccount<'info, TokenAccount>>,
    pub quote_program: Interface<'info, TokenInterface>,
}
#[event]
pub struct PriceRefreshed {
    pub market: Pubkey,
    pub price: u64,
    pub slot: u64,
}
#[event]
pub struct PositionOpened {
    pub position: Pubkey,
    pub owner: Pubkey,
    pub market: Pubkey,
    pub notional: u64,
    pub collateral: u64,
    pub entry_price: u64,
    pub max_profit: u64,
    pub long: bool,
}
#[event]
pub struct PositionSettled {
    pub position: Pubkey,
    pub owner: Pubkey,
    pub market: Pubkey,
    pub payout: u64,
    pub fee: u64,
    pub bounty: u64,
    pub exit_price: u64,
    pub reason: u8,
}
pub use crate::ErrorCode as EngineError;
