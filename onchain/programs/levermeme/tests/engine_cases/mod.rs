//! Engine accounting tests use explicit local price-state fixtures. They do not
//! impersonate a successfully cryptographically verified mainnet oracle update.
use super::*;
use anchor_lang::AccountSerialize;
use levermeme::{Market, MarketRisk, Position};

fn risk() -> MarketRisk {
    MarketRisk {
        feed_hash: [1; 32],
        twap_hash: [2; 32],
        queue: key(70),
        max_price_age_slots: 10,
        max_twap_deviation_bps: 1000,
        min_oracles: 3,
        max_leverage: 10,
        maintenance_bps: 100,
        liquidation_bps: 25,
        spread_bps: 10,
        max_profit_bps: 30000,
        max_open_interest: 10_000_000,
        max_position_notional: 1_000_000,
        minimum_margin: 100,
        minimum_liquidity: 1000,
        emergency_delay_seconds: 3600,
    }
}
struct Trading {
    env: Env,
    listing: Pubkey,
    market: Pubkey,
    vault: Pubkey,
    margin: Pubkey,
    user_vault: Pubkey,
}
impl Trading {
    fn new() -> Self {
        let mut env = Env::new();
        env.pause(false);
        let listing_accounts = env.listing_accounts();
        let listing = listing_accounts.listing;
        env.send(
            env.user,
            ix(
                listing_accounts,
                ix::RequestListing {
                    sol_lamports: 1_000_000,
                    token_amount: 100,
                },
            ),
        )
        .unwrap();
        env.send(
            env.admin,
            ix(
                a::ReviewListing {
                    admin: env.admin,
                    protocol: env.protocol,
                    listing,
                },
                ix::SetListingApproved { approved: true },
            ),
        )
        .unwrap();
        let market = Pubkey::find_program_address(&[b"market", listing.as_ref()], &levermeme::ID).0;
        let vault =
            Pubkey::find_program_address(&[b"market-vault", market.as_ref()], &levermeme::ID).0;
        env.send(
            env.admin,
            ix(
                a::CreateMarket {
                    admin: env.admin,
                    protocol: env.protocol,
                    listing,
                    market,
                    quote_mint: env.quote,
                    market_vault: vault,
                    quote_program: anchor_spl::token::ID,
                    system_program: Pubkey::default(),
                },
                ix::CreateMarket { risk: risk() },
            ),
        )
        .unwrap();
        env.token(key(60), env.quote, env.user, 1_000_000);
        env.send(
            env.user,
            ix(
                a::MarketLiquidity {
                    lister: env.user,
                    protocol: env.protocol,
                    market,
                    quote_mint: env.quote,
                    market_vault: vault,
                    lister_tokens: key(60),
                    quote_program: anchor_spl::token::ID,
                },
                ix::FundMarket { amount: 500_000 },
            ),
        )
        .unwrap();
        let (margin, user_vault) = env.margin();
        env.send(
            env.user,
            ix(
                a::Deposit {
                    owner: env.user,
                    protocol: env.protocol,
                    margin,
                    quote_mint: env.quote,
                    source: key(60),
                    quote_vault: user_vault,
                    quote_program: anchor_spl::token::ID,
                },
                ix::Deposit { amount: 100_000 },
            ),
        )
        .unwrap();
        env.token(key(61), env.quote, env.attacker, 0);
        let mut t = Self {
            env,
            listing,
            market,
            vault,
            margin,
            user_vault,
        };
        t.mark(100_000_000_000_000, 100);
        t.env
            .send(
                t.env.admin,
                ix(
                    a::ManageMarket {
                        admin: t.env.admin,
                        protocol: t.env.protocol,
                        listing,
                        market,
                    },
                    ix::SetMarketEnabled { enabled: true },
                ),
            )
            .unwrap();
        t
    }
    fn mark(&mut self, price: u64, slot: u64) {
        let mut clock = self.env.svm.get_sysvar::<Clock>();
        clock.slot = slot;
        clock.unix_timestamp = 1000 + i64::try_from(slot).unwrap();
        self.env.svm.set_sysvar(&clock);
        let mut account = self.env.svm.get_account(&self.market).unwrap();
        let mut market = self.env.data::<Market>(self.market);
        market.price = price;
        market.twap = price;
        market.price_slot = slot;
        market.price_timestamp = clock.unix_timestamp;
        market
            .try_serialize(&mut account.data.as_mut_slice())
            .unwrap();
        self.env.svm.set_account(self.market, account).unwrap();
    }
    fn open_accounts(&self, id: u64, owner: Pubkey) -> a::OpenPosition {
        let position = Pubkey::find_program_address(
            &[b"position", self.margin.as_ref(), &id.to_le_bytes()],
            &levermeme::ID,
        )
        .0;
        a::OpenPosition {
            owner,
            protocol: self.env.protocol,
            listing: self.listing,
            market: self.market,
            margin: self.margin,
            position,
            quote_mint: self.env.quote,
            user_vault: self.user_vault,
            market_vault: self.vault,
            quote_program: anchor_spl::token::ID,
            system_program: Pubkey::default(),
        }
    }
    fn open(&mut self, id: u64, long: bool) -> Pubkey {
        let accounts = self.open_accounts(id, self.env.user);
        let p = accounts.position;
        let mark = self.env.data::<Market>(self.market).price;
        let expected = if long {
            mark + mark / 1000
        } else {
            mark - mark / 1000
        };
        self.env
            .send(
                self.env.user,
                ix(
                    accounts,
                    ix::OpenPosition {
                        id,
                        collateral: 10_000,
                        leverage: 10,
                        long,
                        expected_price: expected,
                        slippage_bps: 0,
                    },
                ),
            )
            .unwrap();
        p
    }
    fn settle(&mut self, p: Pubkey, actor: Pubkey, reason: u8) -> std::result::Result<(), String> {
        let position = self.env.data::<Position>(p);
        let mark = self.env.data::<Market>(self.market).price;
        let expected = if position.long {
            mark - mark / 1000
        } else {
            mark + mark / 1000
        };
        self.env.send(
            actor,
            ix(
                a::SettlePosition {
                    actor,
                    protocol: self.env.protocol,
                    market: self.market,
                    margin: self.margin,
                    position: p,
                    quote_mint: self.env.quote,
                    user_vault: self.user_vault,
                    market_vault: self.vault,
                    actor_tokens: if actor == self.env.user {
                        key(60)
                    } else {
                        key(61)
                    },
                    quote_program: anchor_spl::token::ID,
                },
                ix::SettlePosition {
                    reason,
                    expected_price: expected,
                    slippage_bps: 0,
                },
            ),
        )
    }
    fn invariant(&self) {
        let m = self.env.data::<Market>(self.market);
        assert!(m.reserved_profit <= m.liquidity);
        assert_eq!(
            self.env.amount(self.vault),
            m.liquidity + m.total_margin + m.accrued_fees
        );
        assert_eq!(
            self.env.amount(self.user_vault),
            self.env.data::<MarginAccount>(self.margin).balance
        );
    }
}
#[test]
fn engine_long_short_open_close_conserve_assets_and_protect_reserved_liquidity() {
    for long in [true, false] {
        let mut t = Trading::new();
        let p = t.open(0, long);
        t.invariant();
        let market = t.env.data::<Market>(t.market);
        assert_eq!(market.reserved_profit, 30_000);
        assert_eq!(t.env.data::<MarginAccount>(t.margin).locked, 10_000);
        assert!(t
            .env
            .send(
                t.env.user,
                ix(
                    a::MarketLiquidity {
                        lister: t.env.user,
                        protocol: t.env.protocol,
                        market: t.market,
                        quote_mint: t.env.quote,
                        market_vault: t.vault,
                        lister_tokens: key(60),
                        quote_program: anchor_spl::token::ID
                    },
                    ix::WithdrawMarketLiquidity { amount: 480_000 }
                )
            )
            .is_err());
        assert!(t.settle(p, t.env.attacker, 0).is_err());
        assert!(t.settle(p, t.env.attacker, 1).is_err());
        t.mark(
            if long {
                110_000_000_000_000
            } else {
                90_000_000_000_000
            },
            101,
        );
        t.env.pause(true);
        t.settle(p, t.env.user, 0).unwrap();
        t.invariant();
        let closed = t.env.data::<Position>(p);
        assert!(closed.closed && closed.payout > 10_000);
        assert_eq!(t.env.data::<MarginAccount>(t.margin).locked, 0);
        assert!(t.settle(p, t.env.user, 0).is_err());
        t.invariant();
    }
}
#[test]
fn engine_rejects_replay_overleverage_slippage_and_wrong_owner() {
    let mut t = Trading::new();
    for (id, owner, lev, price) in [
        (1, t.env.user, 10, 100_100_000_000_000),
        (0, t.env.attacker, 10, 100_100_000_000_000),
        (0, t.env.user, 11, 100_100_000_000_000),
        (0, t.env.user, 10, 1),
    ] {
        assert!(t
            .env
            .send(
                owner,
                ix(
                    t.open_accounts(id, owner),
                    ix::OpenPosition {
                        id,
                        collateral: 10_000,
                        leverage: lev,
                        long: true,
                        expected_price: price,
                        slippage_bps: 0
                    }
                )
            )
            .is_err());
        t.invariant();
    }
    t.open(0, true);
    assert!(t
        .env
        .send(
            t.env.user,
            ix(
                t.open_accounts(0, t.env.user),
                ix::OpenPosition {
                    id: 0,
                    collateral: 10_000,
                    leverage: 10,
                    long: true,
                    expected_price: 100_100_000_000_000,
                    slippage_bps: 0
                }
            )
        )
        .is_err());
    t.invariant();
}
#[test]
fn engine_liquidation_caps_losses_and_profit_cap_is_fully_funded() {
    let mut t = Trading::new();
    let p = t.open(0, true);
    t.mark(91_000_000_000_000, 101);
    t.settle(p, t.env.attacker, 1).unwrap();
    t.invariant();
    assert!(t.env.amount(key(61)) > 0);
    let mut t = Trading::new();
    let p = t.open(0, false);
    t.mark(1, 101);
    t.settle(p, t.env.attacker, 2).unwrap();
    t.invariant();
    assert_eq!(t.env.data::<Position>(p).payout, 39_700);
    let mut t = Trading::new();
    let p = t.open(0, true);
    t.mark(1, 101);
    t.settle(p, t.env.attacker, 1).unwrap();
    t.invariant();
    assert_eq!(t.env.data::<Position>(p).payout, 0);
}
#[test]
fn engine_stale_oracle_blocks_opens_and_exits_until_explicit_outage_resolution() {
    let mut t = Trading::new();
    let p = t.open(0, true);
    let mut clock = t.env.svm.get_sysvar::<Clock>();
    clock.slot = 200;
    clock.unix_timestamp += 100;
    t.env.svm.set_sysvar(&clock);
    assert!(t.settle(p, t.env.user, 0).is_err());
    assert!(t.settle(p, t.env.attacker, 3).is_err());
    clock.unix_timestamp += 3600;
    t.env.svm.set_sysvar(&clock);
    t.settle(p, t.env.attacker, 3).unwrap();
    t.invariant();
    assert_eq!(t.env.data::<Position>(p).reason, 3);
}
#[test]
fn engine_distributes_real_fees_without_touching_reserved_backing() {
    let mut t = Trading::new();
    let p = t.open(0, true);
    let owners = t.env.data::<Protocol>(t.env.protocol).policy.fee_destinations;
    for (account, owner) in [(key(80), owners[0]), (key(81), owners[1]), (key(82), t.env.user), (key(83), owners[2])] {
        t.env.token(account, t.env.quote, owner, 0);
    }
    let before = t.env.data::<Market>(t.market);
    assert_eq!(before.accrued_fees, 300);
    let accounts = a::CollectMarketFees {
        protocol: t.env.protocol, listing: t.listing, market: t.market,
        quote_mint: t.env.quote, market_vault: t.vault,
        treasury: key(80), campaign_fund: key(81), creator: key(82),
        buyback_fund: key(83), quote_program: anchor_spl::token::ID,
    };
    let mut wrong = accounts.clone();
    wrong.creator = key(81);
    assert!(t.env.send(t.env.attacker, ix(wrong, ix::CollectMarketFees {})).is_err());
    t.env.send(t.env.attacker, ix(accounts, ix::CollectMarketFees {})).unwrap();
    assert_eq!([t.env.amount(key(80)),t.env.amount(key(81)),t.env.amount(key(82)),t.env.amount(key(83))], [225,30,15,30]);
    let after = t.env.data::<Market>(t.market);
    assert_eq!(after.liquidity, before.liquidity);
    assert_eq!(after.reserved_profit, before.reserved_profit);
    assert_eq!(after.total_margin, before.total_margin);
    assert_eq!(after.accrued_fees, 0);
    assert_eq!(t.env.data::<Protocol>(t.env.protocol).platform_revenue, 300);
    t.invariant();
    t.settle(p, t.env.user, 0).unwrap();
    t.invariant();
}
#[test]
fn engine_market_escrow_cannot_be_cancelled_while_registered() {
    let mut t = Trading::new();
    let vault =
        Pubkey::find_program_address(&[b"base-vault", t.listing.as_ref()], &levermeme::ID).0;
    assert!(t
        .env
        .send(
            t.env.user,
            ix(
                a::CancelListing {
                    lister: t.env.user,
                    protocol: t.env.protocol,
                    listing: t.listing,
                    base_mint: t.env.base,
                    base_vault: vault,
                    base_destination: key(21),
                    base_program: anchor_spl::token::ID
                },
                ix::CancelListing {}
            )
        )
        .is_err());
}
