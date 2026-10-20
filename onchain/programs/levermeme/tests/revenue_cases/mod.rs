//! Local deterministic CPI fixtures; NOT proof that live Pump/Jupiter accepts a
//! route. Token program execution and transaction rollback are actual LiteSVM.
use super::*;
use anchor_lang::solana_program::instruction::AccountMeta;
use levermeme::revenue::{JUPITER_ID, POOL_DISC, PUMP_AMM_ID};
use levermeme::RevenueLedger;
fn ledger(env: &Env) -> Pubkey {
    Pubkey::find_program_address(&[b"revenue", env.protocol.as_ref()], &levermeme::ID).0
}
fn mock(env: &mut Env, id: Pubkey) {
    let path = std::path::Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("../../target/sbf-solana-solana/release/execution_fixture.so");
    env.svm
        .add_program(
            id,
            &std::fs::read(path).expect("Build SBF test fixture first"),
        )
        .unwrap();
}
fn system(env: &mut Env, address: Pubkey, lamports: u64) {
    env.svm
        .set_account(
            address,
            SvmAccount {
                lamports,
                owner: Pubkey::default(),
                ..SvmAccount::default()
            },
        )
        .unwrap();
}
fn origin(env: &mut Env, creator: Pubkey, quote: Pubkey) -> Pubkey {
    let curve =
        Pubkey::find_program_address(&[b"bonding-curve", env.lever.as_ref()], &levermeme::PUMP_ID)
            .0;
    let mut data = vec![0; 150];
    data[..8].copy_from_slice(&levermeme::CURVE_DISC);
    data[49..81].copy_from_slice(creator.as_ref());
    data[83..115].copy_from_slice(quote.as_ref());
    env.svm
        .set_account(
            curve,
            SvmAccount {
                lamports: 10_000_000,
                owner: levermeme::PUMP_ID,
                data,
                ..SvmAccount::default()
            },
        )
        .unwrap();
    curve
}
fn buyback_env() -> (Env, a::ExecuteBuyback, Vec<AccountMeta>) {
    let mut env = Env::new();
    env.pause(false);
    mock(&mut env, JUPITER_ID);
    let authority = key(33);
    let pool = Pubkey::find_program_address(&[b"fixture-pool"], &JUPITER_ID).0;
    system(&mut env, authority, 100_000_000);
    system(&mut env, pool, 1_000_000);
    env.token(key(90), env.quote, authority, 1000);
    env.token(key(91), env.lever, authority, 77);
    env.token(key(92), env.quote, pool, 10_000);
    env.token(key(93), env.lever, pool, 10_000);
    let accounts = a::ExecuteBuyback {
        authority,
        protocol: env.protocol,
        revenue: ledger(&env),
        input_mint: env.quote,
        input_tokens: key(90),
        lever_mint: env.lever,
        lever_tokens: key(91),
        input_program: anchor_spl::token::ID,
        lever_program: anchor_spl::token::ID,
        jupiter_program: JUPITER_ID,
    };
    let remaining = vec![
        AccountMeta::new_readonly(authority, true),
        AccountMeta::new(key(90), false),
        AccountMeta::new(key(91), false),
        AccountMeta::new_readonly(env.quote, false),
        AccountMeta::new_readonly(env.lever, false),
        AccountMeta::new(key(92), false),
        AccountMeta::new(key(93), false),
        AccountMeta::new_readonly(pool, false),
        AccountMeta::new_readonly(anchor_spl::token::ID, false),
        AccountMeta::new_readonly(anchor_spl::token::ID, false),
    ];
    (env, accounts, remaining)
}
fn buyback_ix(
    accounts: a::ExecuteBuyback,
    remaining: Vec<AccountMeta>,
    input: u64,
    out: u64,
    minimum: u64,
) -> Instruction {
    let mut swap = vec![0];
    swap.extend_from_slice(&input.to_le_bytes());
    swap.extend_from_slice(&out.to_le_bytes());
    let mut instruction = ix(
        accounts,
        ix::ExecuteBuyback {
            input_amount: 100,
            minimum_output: minimum,
            swap_data: swap,
        },
    );
    instruction.accounts.extend(remaining);
    instruction
}
#[test]
fn buyback_burns_only_newly_purchased_tokens_and_counts_actual_input() {
    let (mut env, accounts, remaining) = buyback_env();
    let mint_before = env.svm.get_account(&env.lever).unwrap();
    let before = Mint::unpack(&mint_before.data).unwrap().supply;
    env.send(env.admin, buyback_ix(accounts, remaining, 100, 50, 50))
        .unwrap();
    assert_eq!(env.amount(key(90)), 900);
    assert_eq!(env.amount(key(91)), 77);
    assert_eq!(env.amount(key(92)), 10_100);
    assert_eq!(env.amount(key(93)), 9950);
    assert_eq!(
        Mint::unpack(&env.svm.get_account(&env.lever).unwrap().data)
            .unwrap()
            .supply,
        before - 50
    );
    let data = env.data::<RevenueLedger>(ledger(&env));
    assert_eq!(data.quote_buyback_spent, 100);
    assert_eq!(data.buyback_burned, 50);
}
#[test]
fn failed_buyback_output_and_input_bounds_roll_back_both_sides_and_burn() {
    for (input, out, minimum) in [(100, 49, 50), (101, 50, 50), (99, 50, 50), (100, 50, 0)] {
        let (mut env, accounts, remaining) = buyback_env();
        let mint = env.svm.get_account(&env.lever).unwrap();
        assert!(env
            .send(
                env.admin,
                buyback_ix(accounts, remaining, input, out, minimum)
            )
            .is_err());
        assert_eq!(env.amount(key(90)), 1000);
        assert_eq!(env.amount(key(91)), 77);
        assert_eq!(env.amount(key(92)), 10_000);
        assert_eq!(env.amount(key(93)), 10_000);
        assert_eq!(env.svm.get_account(&env.lever).unwrap().data, mint.data);
        assert_eq!(env.data::<RevenueLedger>(ledger(&env)).buyback_burned, 0);
    }
}
#[test]
fn buyback_rejects_unrelated_wallet_assets_protocol_accounts_wrong_owner_and_pause() {
    let (mut env, accounts, mut remaining) = buyback_env();
    env.token(key(94), env.quote, key(33), 10);
    remaining.push(AccountMeta::new(key(94), false));
    assert!(env
        .send(env.admin, buyback_ix(accounts, remaining, 100, 50, 50))
        .is_err());
    assert_eq!(env.amount(key(94)), 10);
    let (mut env, accounts, mut remaining) = buyback_env();
    remaining.push(AccountMeta::new(env.protocol, false));
    assert!(env
        .send(env.admin, buyback_ix(accounts, remaining, 100, 50, 50))
        .is_err());
    let (mut env, mut accounts, remaining) = buyback_env();
    accounts.authority = env.attacker;
    assert!(env
        .send(env.admin, buyback_ix(accounts, remaining, 100, 50, 50))
        .is_err());
    let (mut env, accounts, remaining) = buyback_env();
    env.pause(true);
    assert!(env
        .send(env.admin, buyback_ix(accounts, remaining, 100, 50, 50))
        .is_err());
}
#[test]
fn native_sol_wrap_swap_and_burn_are_atomic_together() {
    use levermeme::revenue::WSOL;
    let (mut env, mut accounts, mut remaining) = buyback_env();
    let mut mint_data = vec![0; Mint::LEN];
    Mint::pack(
        Mint {
            mint_authority: None.into(),
            supply: 0,
            decimals: 9,
            is_initialized: true,
            freeze_authority: None.into(),
        },
        &mut mint_data,
    )
    .unwrap();
    env.svm
        .set_account(
            WSOL,
            SvmAccount {
                lamports: 10_000_000,
                data: mint_data,
                owner: anchor_spl::token::ID,
                ..SvmAccount::default()
            },
        )
        .unwrap();
    let pool = Pubkey::find_program_address(&[b"fixture-pool"], &JUPITER_ID).0;
    let rent = env
        .svm
        .get_sysvar::<Rent>()
        .minimum_balance(SplAccount::LEN);
    for (address, owner, amount) in [(key(90), key(33), 50), (key(92), pool, 10_000)] {
        env.token(address, WSOL, owner, amount);
        let mut account = env.svm.get_account(&address).unwrap();
        let mut data = SplAccount::unpack(&account.data).unwrap();
        data.is_native = Some(rent).into();
        SplAccount::pack(data, &mut account.data).unwrap();
        account.lamports = rent + amount;
        env.svm.set_account(address, account).unwrap();
    }
    accounts.input_mint = WSOL;
    remaining[3] = AccountMeta::new_readonly(WSOL, false);
    let before_sol = env.svm.get_account(&key(33)).unwrap().lamports;
    for output in [49, 50] {
        let wrap = ix(
            a::WrapBuybackSol {
                authority: key(33),
                protocol: env.protocol,
                wsol_tokens: key(90),
                token_program: anchor_spl::token::ID,
                system_program: Pubkey::default(),
            },
            ix::WrapBuybackSol { amount: 100 },
        );
        let swap = buyback_ix(accounts.clone(), remaining.clone(), 100, output, 50);
        let tx = Transaction::new_unsigned(Message::new_with_blockhash(
            &[wrap, swap],
            Some(&env.admin),
            &env.svm.latest_blockhash(),
        ));
        let result = env.svm.send_transaction(tx);
        if output == 49 {
            assert!(result.is_err());
            assert_eq!(env.svm.get_account(&key(33)).unwrap().lamports, before_sol);
            assert_eq!(env.amount(key(90)), 50);
            assert_eq!(env.amount(key(91)), 77);
        } else {
            result.unwrap();
            assert_eq!(
                env.svm.get_account(&key(33)).unwrap().lamports,
                before_sol - 100
            );
            assert_eq!(env.amount(key(90)), 50);
            assert_eq!(env.amount(key(91)), 77);
            assert_eq!(
                env.data::<RevenueLedger>(ledger(&env)).wsol_buyback_spent,
                100
            );
        }
    }
}
#[test]
fn native_creator_collection_routes_only_new_fees_with_fixed_recipients() {
    let mut env = Env::new();
    mock(&mut env, levermeme::PUMP_ID);
    let user = env.user;
    let curve = origin(&mut env, user, Pubkey::default());
    let vault =
        Pubkey::find_program_address(&[b"creator-vault", user.as_ref()], &levermeme::PUMP_ID).0;
    let event = Pubkey::find_program_address(&[b"__event_authority"], &levermeme::PUMP_ID).0;
    let rent = env.svm.get_sysvar::<Rent>().minimum_balance(0);
    system(&mut env, vault, rent + 1001);
    system(&mut env, event, 1_000_000);
    system(&mut env, key(30), 1_000_000);
    system(&mut env, key(33), 1_000_000);
    let accounts = a::CollectNativeCreatorFees {
        creator: user,
        protocol: env.protocol,
        revenue: ledger(&env),
        origin: curve,
        creator_vault: vault,
        treasury: key(30),
        buyback_fund: key(33),
        event_authority: event,
        pump_program: levermeme::PUMP_ID,
        system_program: Pubkey::default(),
    };
    let before = env.svm.get_account(&user).unwrap().lamports;
    let mut wrong = accounts.clone();
    wrong.treasury = env.attacker;
    assert!(env
        .send(env.admin, ix(wrong, ix::CollectNativeCreatorFees {}))
        .is_err());
    env.send(
        env.admin,
        ix(accounts.clone(), ix::CollectNativeCreatorFees {}),
    )
    .unwrap();
    assert_eq!(env.svm.get_account(&key(30)).unwrap().lamports, 1_000_501);
    assert_eq!(env.svm.get_account(&key(33)).unwrap().lamports, 1_000_500);
    assert_eq!(env.svm.get_account(&user).unwrap().lamports, before);
    assert_eq!(
        env.data::<RevenueLedger>(ledger(&env))
            .native_creator_collected,
        1001
    );
    assert!(env
        .send(env.admin, ix(accounts, ix::CollectNativeCreatorFees {}))
        .is_err());
}
#[test]
fn creator_may_also_be_treasury_without_self_transfer_or_double_counting() {
    let mut env = Env::new();
    mock(&mut env, levermeme::PUMP_ID);
    let creator = key(30);
    let curve = origin(&mut env, creator, Pubkey::default());
    let vault =
        Pubkey::find_program_address(&[b"creator-vault", creator.as_ref()], &levermeme::PUMP_ID).0;
    let event = Pubkey::find_program_address(&[b"__event_authority"], &levermeme::PUMP_ID).0;
    let rent = env.svm.get_sysvar::<Rent>().minimum_balance(0);
    system(&mut env, creator, 100_000_000);
    system(&mut env, key(33), 1_000_000);
    system(&mut env, event, 1_000_000);
    system(&mut env, vault, rent + 1001);
    let accounts = a::CollectNativeCreatorFees {
        creator,
        protocol: env.protocol,
        revenue: ledger(&env),
        origin: curve,
        creator_vault: vault,
        treasury: creator,
        buyback_fund: key(33),
        event_authority: event,
        pump_program: levermeme::PUMP_ID,
        system_program: Pubkey::default(),
    };
    env.send(env.admin, ix(accounts, ix::CollectNativeCreatorFees {}))
        .unwrap();
    assert_eq!(env.svm.get_account(&creator).unwrap().lamports, 100_000_501);
    assert_eq!(env.svm.get_account(&key(33)).unwrap().lamports, 1_000_500);
    assert_eq!(
        env.data::<RevenueLedger>(ledger(&env))
            .native_creator_collected,
        1001
    );
}
#[test]
fn token_creator_collection_supports_curve_and_canonical_amm_without_spending_holdings() {
    for kind in [0, 1] {
        let mut env = Env::new();
        let user = env.user;
        let quote = env.quote;
        let program = if kind == 0 {
            levermeme::PUMP_ID
        } else {
            PUMP_AMM_ID
        };
        mock(&mut env, program);
        let curve = origin(&mut env, user, quote);
        let origin = if kind == 0 {
            curve
        } else {
            let authority = Pubkey::find_program_address(
                &[b"pool-authority", env.lever.as_ref()],
                &levermeme::PUMP_ID,
            )
            .0;
            let pool = Pubkey::find_program_address(
                &[
                    b"pool",
                    &0u16.to_le_bytes(),
                    authority.as_ref(),
                    env.lever.as_ref(),
                    quote.as_ref(),
                ],
                &PUMP_AMM_ID,
            )
            .0;
            let mut data = vec![0; 300];
            data[..8].copy_from_slice(&POOL_DISC);
            data[11..43].copy_from_slice(authority.as_ref());
            data[43..75].copy_from_slice(env.lever.as_ref());
            data[75..107].copy_from_slice(quote.as_ref());
            data[211..243].copy_from_slice(user.as_ref());
            env.svm
                .set_account(
                    pool,
                    SvmAccount {
                        lamports: 10_000_000,
                        owner: program,
                        data,
                        ..SvmAccount::default()
                    },
                )
                .unwrap();
            pool
        };
        let seed: &[u8] = if kind == 0 {
            b"creator-vault"
        } else {
            b"creator_vault"
        };
        let vault_authority = Pubkey::find_program_address(&[seed, user.as_ref()], &program).0;
        system(&mut env, vault_authority, 1_000_000);
        let fee_vault = anchor_spl::associated_token::get_associated_token_address_with_program_id(
            &vault_authority,
            &quote,
            &anchor_spl::token::ID,
        );
        env.token(fee_vault, quote, vault_authority, 1001);
        env.token(key(95), quote, user, 17);
        env.token(key(96), quote, key(30), 0);
        env.token(key(97), quote, key(33), 0);
        let event = Pubkey::find_program_address(&[b"__event_authority"], &program).0;
        system(&mut env, event, 1_000_000);
        let accounts = a::CollectQuoteCreatorFees {
            creator: user,
            protocol: env.protocol,
            revenue: ledger(&env),
            origin,
            input_mint: quote,
            creator_tokens: key(95),
            vault_authority,
            fee_vault,
            treasury: key(96),
            buyback_fund: key(97),
            fee_program: program,
            event_authority: event,
            input_program: anchor_spl::token::ID,
            associated_token_program: anchor_spl::associated_token::ID,
            system_program: Pubkey::default(),
        };
        env.send(
            env.admin,
            ix(accounts, ix::CollectQuoteCreatorFees { source_kind: kind }),
        )
        .unwrap();
        assert_eq!(env.amount(key(95)), 17);
        assert_eq!(env.amount(key(96)), 501);
        assert_eq!(env.amount(key(97)), 500);
        assert_eq!(env.amount(fee_vault), 0);
        assert_eq!(
            env.data::<RevenueLedger>(ledger(&env))
                .quote_creator_collected,
            1001
        );
    }
}
