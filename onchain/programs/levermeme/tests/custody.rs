//! Local SVM only. Public test addresses and disabled cryptographic verification
//! avoid generating signing keys. Anchor signer/account checks still execute.
//! This is not funded mainnet or real-wallet acceptance.
use anchor_lang::solana_program::{instruction::Instruction, program_pack::Pack};
use anchor_lang::{prelude::*, AccountDeserialize, InstructionData, ToAccountMetas};
use anchor_spl::token_interface::spl_token_2022::state::{
    Account as SplAccount, AccountState, Mint,
};
use levermeme::{
    accounts as a, instruction as ix, AirdropCampaign, AirdropClaim, Listing, ListingPolicy,
    MarginAccount, Protocol,
};
use litesvm::LiteSVM;
use solana_account::Account as SvmAccount;
use solana_message::Message;
use solana_transaction::Transaction;

#[path = "engine_cases/mod.rs"]
mod engine_cases;
#[path = "revenue_cases/mod.rs"]
mod revenue_cases;

fn key(byte: u8) -> Pubkey {
    Pubkey::new_from_array([byte; 32])
}
fn ix<A: ToAccountMetas, D: InstructionData>(accounts: A, data: D) -> Instruction {
    Instruction {
        program_id: levermeme::ID,
        accounts: accounts.to_account_metas(None),
        data: data.data(),
    }
}
struct Env {
    svm: LiteSVM,
    admin: Pubkey,
    user: Pubkey,
    attacker: Pubkey,
    protocol: Pubkey,
    lever: Pubkey,
    quote: Pubkey,
    base: Pubkey,
}
impl Env {
    fn new() -> Self {
        let mut svm = LiteSVM::new()
            .with_sigverify(false)
            .with_transaction_history(0);
        let so = std::path::Path::new(env!("CARGO_MANIFEST_DIR"))
            .join("../../target/sbf-solana-solana/release/levermeme.so");
        svm.add_program(
            levermeme::ID,
            &std::fs::read(so).expect("Build SBF artifact first using scripts/build-onchain.mjs"),
        )
        .unwrap();
        let (admin, user, attacker, lever, quote, base) =
            (key(1), key(2), key(3), key(10), key(11), key(12));
        for address in [admin, user, attacker] {
            svm.set_account(
                address,
                SvmAccount {
                    lamports: 100_000_000_000,
                    owner: Pubkey::default(),
                    ..SvmAccount::default()
                },
            )
            .unwrap();
        }
        for mint in [lever, quote, base] {
            let mut data = vec![0; Mint::LEN];
            Mint::pack(
                Mint {
                    mint_authority: None.into(),
                    supply: 1_000_000_000,
                    decimals: 6,
                    is_initialized: true,
                    freeze_authority: None.into(),
                },
                &mut data,
            )
            .unwrap();
            svm.set_account(
                mint,
                SvmAccount {
                    lamports: 10_000_000,
                    data,
                    owner: anchor_spl::token::ID,
                    ..SvmAccount::default()
                },
            )
            .unwrap();
        }
        let protocol =
            Pubkey::find_program_address(&[b"protocol", admin.as_ref()], &levermeme::ID).0;
        let curve_for = |mint: Pubkey| {
            Pubkey::find_program_address(&[b"bonding-curve", mint.as_ref()], &levermeme::PUMP_ID).0
        };
        for mint in [lever, quote] {
            let mut data = vec![0; 49];
            data[..8].copy_from_slice(&levermeme::CURVE_DISC);
            svm.set_account(
                curve_for(mint),
                SvmAccount {
                    lamports: 10_000_000,
                    data,
                    owner: levermeme::PUMP_ID,
                    ..SvmAccount::default()
                },
            )
            .unwrap();
        }
        let mut env = Self {
            svm,
            admin,
            user,
            attacker,
            protocol,
            lever,
            quote,
            base,
        };
        env.send(
            admin,
            ix(
                a::InitializeProtocol {
                    admin,
                    protocol,
                    revenue: Pubkey::find_program_address(
                        &[b"revenue", protocol.as_ref()],
                        &levermeme::ID,
                    )
                    .0,
                    lever_mint: lever,
                    quote_mint: quote,
                    lever_curve: curve_for(lever),
                    quote_curve: curve_for(quote),
                    system_program: Pubkey::default(),
                },
                ix::InitializeProtocol {
                    policy: ListingPolicy {
                        burn_amount: 100,
                        min_sol_lamports: 1_000_000,
                        fee_bps: 30,
                        fee_shares: [7500, 1000, 500, 1000],
                        fee_destinations: [key(30), key(31), key(33)],
                    },
                },
            ),
        )
        .unwrap();
        env
    }
    fn send(&mut self, payer: Pubkey, instruction: Instruction) -> std::result::Result<(), String> {
        let tx = Transaction::new_unsigned(Message::new_with_blockhash(
            &[instruction],
            Some(&payer),
            &self.svm.latest_blockhash(),
        ));
        self.svm
            .send_transaction(tx)
            .map(|_| ())
            .map_err(|error| format!("{:?}\n{:?}", error.err, error.meta.logs))
    }
    fn token(&mut self, address: Pubkey, mint: Pubkey, owner: Pubkey, amount: u64) {
        let mut data = vec![0; SplAccount::LEN];
        SplAccount::pack(
            SplAccount {
                mint,
                owner,
                amount,
                state: AccountState::Initialized,
                ..SplAccount::default()
            },
            &mut data,
        )
        .unwrap();
        self.svm
            .set_account(
                address,
                SvmAccount {
                    lamports: 10_000_000,
                    data,
                    owner: anchor_spl::token::ID,
                    ..SvmAccount::default()
                },
            )
            .unwrap();
    }
    fn amount(&self, address: Pubkey) -> u64 {
        SplAccount::unpack(&self.svm.get_account(&address).unwrap().data)
            .unwrap()
            .amount
    }
    fn mint_supply(&self, address: Pubkey) -> u64 {
        Mint::unpack(&self.svm.get_account(&address).unwrap().data)
            .unwrap()
            .supply
    }
    fn data<T: AccountDeserialize>(&self, address: Pubkey) -> T {
        T::try_deserialize(&mut self.svm.get_account(&address).unwrap().data.as_slice()).unwrap()
    }
    fn pause(&mut self, paused: bool) {
        self.send(
            self.admin,
            ix(
                a::AdminProtocol {
                    admin: self.admin,
                    protocol: self.protocol,
                },
                ix::SetPaused { paused },
            ),
        )
        .unwrap();
    }
    fn margin(&mut self) -> (Pubkey, Pubkey) {
        let margin = Pubkey::find_program_address(
            &[b"margin", self.protocol.as_ref(), self.user.as_ref()],
            &levermeme::ID,
        )
        .0;
        let vault =
            Pubkey::find_program_address(&[b"quote-vault", margin.as_ref()], &levermeme::ID).0;
        self.send(
            self.user,
            ix(
                a::OpenMarginAccount {
                    owner: self.user,
                    protocol: self.protocol,
                    quote_mint: self.quote,
                    margin,
                    quote_vault: vault,
                    quote_program: anchor_spl::token::ID,
                    system_program: Pubkey::default(),
                },
                ix::OpenMarginAccount {},
            ),
        )
        .unwrap();
        (margin, vault)
    }
    fn listing_accounts(&mut self) -> a::RequestListing {
        let permit = Pubkey::find_program_address(
            &[
                b"listing-permit",
                self.protocol.as_ref(),
                self.base.as_ref(),
                self.user.as_ref(),
            ],
            &levermeme::ID,
        )
        .0;
        if self.svm.get_account(&permit).is_none() {
            let now = self.svm.get_sysvar::<Clock>().unix_timestamp;
            self.send(
                self.admin,
                ix(
                    a::ApproveListingPermit {
                        admin: self.admin,
                        protocol: self.protocol,
                        base_mint: self.base,
                        lister: self.user,
                        permit,
                        system_program: Pubkey::default(),
                    },
                    ix::ApproveListingPermit {
                        expires_at: now + 604000,
                    },
                ),
            )
            .unwrap();
        }
        let listing = Pubkey::find_program_address(
            &[b"listing", self.protocol.as_ref(), self.base.as_ref()],
            &levermeme::ID,
        )
        .0;
        let base_vault =
            Pubkey::find_program_address(&[b"base-vault", listing.as_ref()], &levermeme::ID).0;
        let curve = Pubkey::find_program_address(
            &[b"bonding-curve", self.base.as_ref()],
            &levermeme::PUMP_ID,
        )
        .0;
        let mut data = vec![0; 49];
        data[..8].copy_from_slice(&levermeme::CURVE_DISC);
        self.svm
            .set_account(
                curve,
                SvmAccount {
                    lamports: 10_000_000,
                    data,
                    owner: levermeme::PUMP_ID,
                    ..SvmAccount::default()
                },
            )
            .unwrap();
        self.token(key(20), self.lever, self.user, 10_000);
        self.token(key(21), self.base, self.user, 1000);
        a::RequestListing {
            lister: self.user,
            protocol: self.protocol,
            permit,
            listing,
            base_mint: self.base,
            pump_curve: curve,
            lever_mint: self.lever,
            lever_source: key(20),
            base_source: key(21),
            base_vault,
            lever_program: anchor_spl::token::ID,
            base_program: anchor_spl::token::ID,
            system_program: Pubkey::default(),
        }
    }
}

#[test]
fn deposits_and_owner_only_withdrawals_preserve_balances_and_work_while_paused() {
    let mut env = Env::new();
    let (margin, vault) = env.margin();
    env.token(key(22), env.quote, env.user, 10_000);
    env.token(key(23), env.quote, env.attacker, 0);
    let deposit = || a::Deposit {
        owner: key(2),
        protocol: Pubkey::find_program_address(&[b"protocol", key(1).as_ref()], &levermeme::ID).0,
        margin,
        quote_mint: key(11),
        source: key(22),
        quote_vault: vault,
        quote_program: anchor_spl::token::ID,
    };
    assert!(env
        .send(env.user, ix(deposit(), ix::Deposit { amount: 1000 }))
        .is_err());
    env.pause(false);
    env.send(env.user, ix(deposit(), ix::Deposit { amount: 1000 }))
        .unwrap();
    assert_eq!(env.amount(vault), 1000);
    assert_eq!(env.amount(key(22)), 9000);
    assert_eq!(env.data::<MarginAccount>(margin).balance, 1000);
    let withdraw = |owner, destination| a::Withdraw {
        owner,
        protocol: Pubkey::find_program_address(&[b"protocol", key(1).as_ref()], &levermeme::ID).0,
        margin,
        quote_mint: key(11),
        destination,
        quote_vault: vault,
        quote_program: anchor_spl::token::ID,
    };
    assert!(env
        .send(
            env.attacker,
            ix(withdraw(env.attacker, key(23)), ix::Withdraw { amount: 1 })
        )
        .is_err());
    assert!(env
        .send(
            env.user,
            ix(withdraw(env.user, key(23)), ix::Withdraw { amount: 1 })
        )
        .is_err());
    assert!(env
        .send(
            env.user,
            ix(withdraw(env.user, key(22)), ix::Withdraw { amount: 1001 })
        )
        .is_err());
    env.pause(true);
    env.send(
        env.user,
        ix(withdraw(env.user, key(22)), ix::Withdraw { amount: 1000 }),
    )
    .unwrap();
    assert_eq!(env.amount(key(22)), 10_000);
    assert_eq!(env.data::<MarginAccount>(margin).balance, 0);
    assert_eq!(env.amount(vault), 0);
}

#[test]
fn listing_burn_is_atomic_and_owner_can_refund_liquidity_not_the_burn() {
    let mut env = Env::new();
    env.pause(false);
    let accounts = env.listing_accounts();
    let listing = accounts.listing;
    let vault = accounts.base_vault;
    let original_supply = env.mint_supply(env.lever);
    assert!(env
        .send(
            env.user,
            ix(
                accounts,
                ix::RequestListing {
                    sol_lamports: 1_000_000,
                    token_amount: 1001
                }
            )
        )
        .is_err());
    assert_eq!(env.mint_supply(env.lever), original_supply);
    assert_eq!(env.amount(key(20)), 10_000);
    let accounts = env.listing_accounts();
    env.send(
        env.user,
        ix(
            accounts,
            ix::RequestListing {
                sol_lamports: 1_000_000,
                token_amount: 100,
            },
        ),
    )
    .unwrap();
    assert_eq!(env.mint_supply(env.lever), original_supply - 100);
    assert_eq!(env.amount(key(20)), 9900);
    assert_eq!(env.amount(vault), 100);
    assert!(!env.data::<Listing>(listing).approved);
    assert!(env
        .send(
            env.attacker,
            ix(
                a::ReviewListing {
                    admin: env.attacker,
                    protocol: env.protocol,
                    listing
                },
                ix::SetListingApproved { approved: true }
            )
        )
        .is_err());
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
    assert!(env.data::<Listing>(listing).approved);
    env.pause(true);
    let cancel = || a::CancelListing {
        lister: key(2),
        protocol: Pubkey::find_program_address(&[b"protocol", key(1).as_ref()], &levermeme::ID).0,
        listing,
        base_mint: key(12),
        base_vault: vault,
        base_destination: key(21),
        base_program: anchor_spl::token::ID,
    };
    env.send(env.user, ix(cancel(), ix::CancelListing {}))
        .unwrap();
    assert_eq!(env.amount(key(21)), 1000);
    assert_eq!(env.amount(vault), 0);
    assert_eq!(env.amount(key(20)), 9900);
    assert!(env.data::<Listing>(listing).cancelled);
    assert!(!env.data::<Listing>(listing).approved);
    assert!(env
        .send(env.user, ix(cancel(), ix::CancelListing {}))
        .is_err());
    assert_eq!(env.data::<Protocol>(env.protocol).total_burned, 100);
}

#[test]
fn listing_rejects_curve_substitution_and_unsafe_mints_without_burning() {
    let mut env = Env::new();
    env.pause(false);
    for attack in 0..4 {
        let mut accounts = env.listing_accounts();
        match attack {
            0 => accounts.pump_curve = env.base,
            1 | 2 => {
                let mut curve = env.svm.get_account(&accounts.pump_curve).unwrap();
                if attack == 1 {
                    curve.owner = env.attacker;
                } else {
                    curve.data[0] ^= 1;
                }
                env.svm.set_account(accounts.pump_curve, curve).unwrap();
            }
            _ => {
                let mut account = env.svm.get_account(&env.base).unwrap();
                let mut mint = Mint::unpack(&account.data).unwrap();
                mint.freeze_authority = Some(env.attacker).into();
                Mint::pack(mint, &mut account.data).unwrap();
                env.svm.set_account(env.base, account).unwrap();
            }
        }
        let supply = env.mint_supply(env.lever);
        assert!(env
            .send(
                env.user,
                ix(
                    accounts,
                    ix::RequestListing {
                        sol_lamports: 1_000_000,
                        token_amount: 100
                    }
                )
            )
            .is_err());
        assert_eq!(env.mint_supply(env.lever), supply);
        assert_eq!(env.amount(key(20)), 10_000);
    }
}

#[test]
fn admission_requires_an_operator_permit_and_lister_signature_before_burning() {
    let mut env = Env::new();
    env.pause(false);
    let mut accounts = env.listing_accounts();
    accounts.permit = env.attacker;
    assert!(env
        .send(
            env.user,
            ix(
                accounts,
                ix::RequestListing {
                    sol_lamports: 1_000_000,
                    token_amount: 100
                }
            )
        )
        .is_err());
    let accounts = env.listing_accounts();
    let mut instruction = ix(
        accounts,
        ix::RequestListing {
            sol_lamports: 1_000_000,
            token_amount: 100,
        },
    );
    instruction.accounts[0].is_signer = false;
    assert!(env.send(env.attacker, instruction).is_err());
    assert_eq!(env.amount(key(20)), 10_000);
    assert_eq!(env.mint_supply(env.lever), 1_000_000_000);
}

#[test]
fn unauthorized_admin_and_missing_signer_are_rejected() {
    let mut env = Env::new();
    assert!(env
        .send(
            env.attacker,
            ix(
                a::AdminProtocol {
                    admin: env.attacker,
                    protocol: env.protocol
                },
                ix::SetPaused { paused: false }
            )
        )
        .is_err());
    let mut instruction = ix(
        a::AdminProtocol {
            admin: env.admin,
            protocol: env.protocol,
        },
        ix::SetPaused { paused: false },
    );
    instruction.accounts[0].is_signer = false;
    assert!(env.send(env.attacker, instruction).is_err());
    assert!(env.data::<Protocol>(env.protocol).paused);
}

#[test]
fn airdrop_is_funded_at_ten_percent_and_claim_is_wallet_bound_and_not_replayable() {
    let mut env = Env::new();
    let campaign =
        Pubkey::find_program_address(&[b"airdrop", env.protocol.as_ref()], &levermeme::ID).0;
    let vault =
        Pubkey::find_program_address(&[b"airdrop-vault", campaign.as_ref()], &levermeme::ID).0;
    let claim = Pubkey::find_program_address(
        &[b"claim", campaign.as_ref(), env.user.as_ref()],
        &levermeme::ID,
    )
    .0;
    env.token(key(24), env.lever, env.admin, 100_000_000);
    env.token(key(25), env.lever, env.user, 0);
    let root = levermeme::airdrop_leaf(campaign, env.user, 0, 1000);
    let mut clock = env.svm.get_sysvar::<anchor_lang::prelude::Clock>();
    clock.unix_timestamp = 100;
    env.svm.set_sysvar(&clock);
    env.send(
        env.admin,
        ix(
            a::CreateAirdrop {
                admin: env.admin,
                protocol: env.protocol,
                lever_mint: env.lever,
                campaign,
                airdrop_vault: vault,
                source: key(24),
                lever_program: anchor_spl::token::ID,
                system_program: Pubkey::default(),
            },
            ix::CreateAirdrop {
                root,
                starts_at: 100,
                ends_at: 200,
            },
        ),
    )
    .unwrap();
    assert_eq!(env.amount(vault), 100_000_000);
    assert_eq!(env.data::<AirdropCampaign>(campaign).total, 100_000_000);
    let accounts = || a::ClaimAirdrop {
        owner: key(2),
        protocol: Pubkey::find_program_address(&[b"protocol", key(1).as_ref()], &levermeme::ID).0,
        campaign,
        claim,
        lever_mint: key(10),
        airdrop_vault: vault,
        destination: key(25),
        lever_program: anchor_spl::token::ID,
        system_program: Pubkey::default(),
    };
    assert!(env
        .send(
            env.user,
            ix(
                accounts(),
                ix::ClaimAirdrop {
                    index: 0,
                    amount: 1001,
                    proof: vec![]
                }
            )
        )
        .is_err());
    env.send(
        env.user,
        ix(
            accounts(),
            ix::ClaimAirdrop {
                index: 0,
                amount: 1000,
                proof: vec![],
            },
        ),
    )
    .unwrap();
    assert_eq!(env.amount(key(25)), 1000);
    assert_eq!(env.data::<AirdropClaim>(claim).amount, 1000);
    assert!(env
        .send(
            env.user,
            ix(
                accounts(),
                ix::ClaimAirdrop {
                    index: 0,
                    amount: 1000,
                    proof: vec![]
                }
            )
        )
        .is_err());
    assert_eq!(env.amount(key(25)), 1000);
}

#[test]
fn revenue_routes_to_configured_owners_with_approved_creator_royalty() {
    let mut env = Env::new();
    env.pause(false);
    let accounts = env.listing_accounts();
    let listing = accounts.listing;
    env.send(
        env.user,
        ix(
            accounts,
            ix::RequestListing {
                sol_lamports: 1_000_000,
                token_amount: 100,
            },
        ),
    )
    .unwrap();
    env.token(key(35), env.quote, env.admin, 20_000);
    for (account, owner) in [
        (key(40), key(30)),
        (key(41), key(31)),
        (key(42), env.user),
        (key(43), key(33)),
    ] {
        env.token(account, env.quote, owner, 0);
    }
    let route = || a::RoutePlatformRevenue {
        admin: key(1),
        protocol: Pubkey::find_program_address(&[b"protocol", key(1).as_ref()], &levermeme::ID).0,
        listing,
        quote_mint: key(11),
        source: key(35),
        treasury: key(40),
        campaign_fund: key(41),
        creator: key(42),
        buyback_fund: key(43),
        quote_program: anchor_spl::token::ID,
    };
    assert!(env
        .send(
            env.admin,
            ix(route(), ix::RoutePlatformRevenue { amount: 10_000 })
        )
        .is_err());
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
    let mut substituted = route();
    env.token(key(44), env.quote, env.attacker, 0);
    substituted.creator = key(44);
    assert!(env
        .send(
            env.admin,
            ix(substituted, ix::RoutePlatformRevenue { amount: 10_000 })
        )
        .is_err());
    assert_eq!(env.amount(key(35)), 20_000);
    env.send(
        env.admin,
        ix(route(), ix::RoutePlatformRevenue { amount: 10_000 }),
    )
    .unwrap();
    assert_eq!(
        [
            env.amount(key(40)),
            env.amount(key(41)),
            env.amount(key(42)),
            env.amount(key(43))
        ],
        [7500, 1000, 500, 1000]
    );
    env.send(
        env.admin,
        ix(
            a::RouteTokenCreatorRevenue {
                admin: env.admin,
                protocol: env.protocol,
                quote_mint: env.quote,
                source: key(35),
                treasury: key(40),
                buyback_fund: key(43),
                quote_program: anchor_spl::token::ID,
            },
            ix::RouteTokenCreatorRevenue { amount: 10_000 },
        ),
    )
    .unwrap();
    assert_eq!(env.amount(key(40)), 12500);
    assert_eq!(env.amount(key(43)), 6000);
    assert_eq!(env.amount(key(35)), 0);
    assert_eq!(env.data::<Protocol>(env.protocol).platform_revenue, 10000);
    assert_eq!(
        env.data::<Protocol>(env.protocol).token_creator_revenue,
        10000
    );
}
