# Low-cost launch plan — October 23, 2026

## Current state, simply

The Vercel website is public. It is not an active mainnet exchange. `/api/runtime` reports `configured: false`, no markets and both funding switches false. Program/operator/mint identities are unset. No operator services or real oracle/trade acceptance are verified live. Tests are not a substitute for deployment, funding or review.

The implemented trading product is isolated long/short leverage with fully reserved, capped profits and no perpetual funding payments. Copy now calls it “Leveraged trading. For pump.fun coins.” Do not relabel it as conventional perpetual futures without implementing/reviewing those different economics.

## What needs deploying

1. **The program:** finalize public operator/program/LeverMeme/xSOL identities, run `npm run setup -- --config <public-config.json>`, and deploy the exact rebuilt canonical `onchain/target/sbf-solana-solana/release/levermeme.so` through a secure signer after transaction/cost review. Never deploy `execution_fixture.so` or upload a wallet key. Use exact artifact size as `--max-len`, not unused doubled capacity.
2. **Initialization and one small reviewed market:** initialize paused in `/admin/`, review fixed recipients/terms, verify real oracle jobs, admit a controlled listing and provide separate xSOL market reserves. SOL/token admission escrow is not trading capital or automatic conversion.
3. **Operations:** deploy the market keeper and independent policy-bound signer using `services/compose.yaml` and `services/signing.compose.yaml`; attach scoped IAM/workload identity, TLS, monitoring and durable volumes. Start simulation-only. Do not enable execution or public deposits before independent review and approved funded acceptance.
4. **Release checks:** verify deposit → long/short → close → withdraw, liquidation, caps, reserve accounting, pause/exits, real oracle operation, fee routes and recovery with confirmed receipts. Then deliberately approve public activation. Existing flags stay disabled until this happens.

## Measured program storage

`npm run estimate:deployment` is a read-only mainnet RPC quote for the locally built artifact. It checks mainnet genesis and queries `getMinimumBalanceForRentExemption`; no old rent-rate constant is assumed.

Measured October 23 at 17:38 UTC for a **973,776-byte** stripped build candidate (SHA-256 `bd4416ee68bc16bff1889596b3ea3562fc871d06a209ad6e53330638c07504f2`):

| Item | SOL |
| --- | ---: |
| Program + exact-size ProgramData storage | 4.948494040 |
| Protocol + revenue ledger initialization storage | 0.003114040 |
| Temporary buffer storage | 4.947620280 |
| Conservative buffer-plus-program wallet headroom | 9.896114320 |

The headroom figure is **not** an additional permanent fee. Buffer funds may be reclaimed/reused by the reviewed deployment flow. Rent is locked account storage; safely recovering program storage is not a routine refund because closing a program affects availability. Transaction/priority fees, retries, user/market accounts and liquidity are extra. Final identity rebuilds can change size: re-quote the exact final binary immediately before signing.

Release post-processing now uses the official SBF `llvm-objcopy --strip-all` approach. It reduced this candidate from 1,126,936 to 973,776 bytes (153,160 bytes / about 13.6%), lowering the observed program storage requirement by 0.778052800 SOL. All existing Rust/SVM cases were rerun against the stripped canonical artifacts. No trading rules were changed. References: [official SBF strip script](https://github.com/anza-xyz/cargo-build-sbf/blob/master/sbf/scripts/strip.sh), [Solana deployment](https://solana.com/docs/programs/deploying).

## Smallest sensible recurring setup

These are published starting prices, not an all-in production quote or a service purchase:

| Component | Planning allowance | Notes |
| --- | --- | --- |
| Existing Vercel site | $20/month Pro starting price | Hobby is restricted to personal/non-commercial use. Existing paid capacity may cover this project. |
| Always-on worker host | $6–12/month starting VM range | DigitalOcean lists 1 GiB at $6 and 2 GiB at $12. Capacity, backups and isolation must be validated, not assumed from price. |
| KMS signing key | $1/key/month + signing/API usage | Start with the market role. Creator-fee collection/buybacks can remain manual wallet-approved actions initially; extra automatic roles cost extra. No private signing keys are exported. |
| RPC | $0 for testing / quota-limited pilot; paid tier as needed | Helius lists Free at 1M credits/10 RPS and Developer at $49/month. The current keeper scans and deployment-verification reads can exhaust free credits quickly; do not assume $0 at live volume. |
| Oracle, monitoring, backups and usage | Variable / provider quote required | Signed oracle operation is essential, not optional. Current Crossbar success is unverified; there is no basis to promise a free oracle service. |

Rough base infrastructure allowance: **$30–45/month plus RPC/oracle/API/backup usage and applicable taxes**, before liquidity or professional review. This is not a guaranteed production budget. A fee-generating public exchange should not be priced as a free personal Vercel site.

Primary pricing references checked October 23: [Vercel](https://vercel.com/pricing), [Hobby restrictions](https://vercel.com/docs/plans/hobby), [DigitalOcean](https://www.digitalocean.com/pricing/droplets), [AWS KMS](https://aws.amazon.com/kms/pricing/), [Helius](https://www.helius.dev/pricing).

## Capital and review are separate

Trading needs actual xSOL reserves, and any lending pool needs actual lender SOL. Neither is created by paying deployment rent. The initial admission burn, listing escrow, account rent, funded airdrop and security/economic review are separate. There is no responsible fixed all-in total before final assets, market limits, provider requirements and review scope are known.

Keep v1 small: one reviewed market, conservative risk limits, no automatically executing revenue roles initially, no extra custom domains/paid chart stack, and no lending balances taken before lending contracts and terms exist. Never lower oracle, key-management or accounting protections just to meet a cheaper headline price.

## Lending: proposed, not implemented on chain

`/lending/` is a clearly labeled design preview with an exact-unit **illustrative** 25% LTV calculator. Example: 10 SOL of collateral value gives at most 2.5 SOL principal before haircuts. User-entered values are not oracles or credit approvals. No pool, loan, deposit, yield or transaction endpoint is created by this preview. Current trading treasury and reserved payouts remain untouched.

Before implementing financial contracts, confirm: 25% means borrower LTV (not lender yield); loan duration; interest charge; grace period; approved collateral/valuation sources and haircuts; early liquidation threshold; liquidation costs; and treatment of surplus collateral. These choices materially determine who can lose money. Default does not automatically make a thin meme asset worth enough to repay SOL debt. A separate lending program/review/deployment budget is **not included** in the current trading program quote.

SOL lending also needs verified collateral-to-SOL valuation. Existing trading marks are meme/xSOL; they must not be treated as meme/SOL prices. A direct reviewed feed or correctly validated conversion with independent freshness/deviation/liquidity limits is required.

## Design/copy scope

The Project Optimizer standard guided direct product copy, risk accuracy, explicit inactive states and original SVGs for new UI. Existing terminal layout/brand and all financial gates were preserved. [21st.dev](https://21st.dev/) and [React Bits](https://reactbits.dev/) catalogs were consulted; no external component source, animation library, stock design or competitor identity was copied. The new lending view adapts the existing in-repo cards/forms; no new runtime dependency was added.
