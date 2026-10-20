# LeverMeme

Pump.fun-origin meme markets on Solana, paired against the configured xSOL mint. Up to 10× isolated long/short exposure with **fully reserved, capped profits**, not uncapped perpetuals. No fabricated markets, volume, charts or positions.

Public interface: https://levermeme.vercel.app
Source: https://github.com/jaycarson373-tech/lev-pad

## Current release status

The website can be published; accepting production funds is NOT yet authorized or verified. The default configuration rejects funding/trading. No program deployment, initialization or mainnet trade has been sent by this implementation.

Implemented v3: admission permits, atomic listing burn/SOL/token escrow, manual approval, owner-only available-collateral withdrawals, capped leverage engine, reserves, settlement/liquidation, oracle verification, fee distribution, funded Merkle airdrop, generated IDL/client, simulated wallet approval/confirmation, public setup wizard, operator console, direct creator-fee collection, atomic Jupiter buyback-and-burn, verified lookup tables, durable worker roles and a concrete policy-bound AWS KMS signer adapter.

Still required: actual mint and program identities, secure program deployment, live oracle-provider acceptance, independent security/economic review, funded end-to-end acceptance, production RPC, funded xSOL reserves and a deployed/monitored keeper. A private key and CA alone are insufficient. Never paste a key into chat, source or Vercel.

## Run and verify

Requires Node 22+, Rust, Anchor 1.1.2 and Solana platform-tools for on-chain work.

```sh
npm ci
npm test
npm run build
npm run test:browser
npm run build:onchain
npm run test:onchain
npm run check:release
```

The last command is read-only and deliberately exits nonzero while setup is incomplete. It is an operational check, not a security certification. GitHub Actions verifies JavaScript, production dependency advisories and browser behavior. Rust/SBF checks run separately with the documented toolchain.

Routes: /, /trade/, /list-token/, /portfolio/, /ecosystem/, /admin/. Source: web/. Generated site: dist/. Vercel serves api/ functions; a plain static server does not. Browser tests run a local API adapter and write screenshots outside this checkout to the workspace outputs/ directory.

## Activation configuration

Open /admin/ to save a public setup draft and add final identities later. Download it, then use `npm run setup -- --config /path/to/levermeme-launch.json` to rebuild the fresh program identity/IDL/client, test and compute the artifact hash without a key. It does not deploy, sign or enable funding. See [OPERATIONS.md](OPERATIONS.md) for the complete workflow.

Public configuration lives in config/launch.json; a server-only LEVERMEME_LAUNCH_CONFIG JSON override is supported. Use public program/admin/mint addresses, reviewed SBF SHA-256 and byte size, expected upgrade authority (null only for immutable), and links to actual review/acceptance reports. Report links are not automatically authenticated audit evidence.

Set SOLANA_RPC_URL in Vercel for reliable mainnet reads/simulation. SWITCHBOARD_CROSSBAR_URL selects a reviewed HTTPS Crossbar provider. The documented public default did not resolve during this release; no live provider-format/oracle acceptance is claimed.

The backend pins mainnet genesis, program loader/ProgramData PDA, deployed bytecode and upgrade authority before constructing or relaying transactions. It verifies protocol namespace, token identities, ownership and discriminators. Default template identities are rejected.

Initialize from /admin/ using the configured operator wallet. Initialization starts paused. Review recipient owners, actual burn/minimum funding and immutable per-market oracle/risk settings. Admission is permit → lister burn/fund → operator approval → additional xSOL capital → verified oracle → explicit enablement. Only enable custody/trading website flags after the release checklist passes.

## Economics and boundaries

Platform fees: 75% treasury/liquidity/insurance, 10% campaigns, 5% actual market lister, 10% buyback allocation. LeverMeme's collected-and-converted creator revenue has a separate 50/50 treasury/buyback route. A separately funded airdrop uses exactly floor(initial supply / 10).

Fee routing transfers actual xSOL; treasury/campaign/buyback recipients control funds after receipt. Direct Pump/PumpSwap creator-fee collection now atomically splits newly received SOL/WSOL/xSOL 50/50. Creator vaults aggregate all coins using that creator identity, which is disclosed before signing. The fixed buyback owner can execute a bounded Jupiter swap and burn all newly purchased LeverMeme in one atomic action, without burning pre-existing holdings or spending user collateral. Optional capped worker execution uses an independently configured managed signer. Neither the 75% treasury allocation nor admission escrow is automatically invested/converted into market liquidity.

SOL + meme-token admission escrow is NOT an AMM or xSOL conversion. Listers must additionally supply real xSOL reserve capital. Markets do not pay bank interest or guaranteed returns. Fully reserved caps limit payouts to isolated collateral plus reserved profit; oracle integrity and timely operation still matter.

## Keeper

```sh
KEEPER_WALLET_ADDRESS=<public-address> npm run keeper -- --once
```

Default is simulation-only. Execution additionally requires --execute, KEEPER_REMOTE_SIGNER_URL (HTTPS), explicit KEEPER_MAX_LAMPORTS_PER_TX and KEEPER_DAILY_LAMPORTS, and a server-side signing-service token when required. Separate creator-fees/buybacks roles are supported; buybacks additionally require explicit per-action/daily token-input caps. No local wallet-key loader exists. The optional services/signer implementation uses an existing KMS key with independent action, namespace, simulation and budget checks; cloud permissions/TLS/deployment are not provisioned automatically.

Use a durable .runtime/ volume and one process. Pending signatures block new submissions until resolved. The runner reserves conservative daily costs, bounds each simulated SOL debit, checks signed message equality, and persists signatures before broadcast. It is not deployed on Vercel; serverless request handlers are not durable liquidation daemons. After a crash, confirm the process is stopped and reconcile the stored signature before manually removing a stale keeper.lock. Monitoring, redundant oracle connectivity and alerting remain operational requirements.

Verification: 57 JavaScript tests, 10 Rust units and 20 LiteSVM integration tests passed; SBF build and responsive browser checks passed. Production dependency audits reported zero advisories, including the isolated KMS service package. Tests using CPI counterparts and public signature vectors are explicitly local fixtures, not real Pump/Jupiter/KMS execution acceptance. A read-only live Jupiter V2 request passed the actual adapter's format checks; no swap was signed or submitted. Live oracle and funded market acceptance remain unverified.

See [onchain/README.md](onchain/README.md), [OPERATIONS.md](OPERATIONS.md) and [RELEASE.md](RELEASE.md) for exact limits and acceptance steps.
