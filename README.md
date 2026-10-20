# LeverMeme

Pump.fun-origin meme markets on Solana, paired against the configured xSOL mint. Up to 10× isolated long/short exposure with **fully reserved, capped profits**, not uncapped perpetuals. No fabricated markets, volume, charts or positions.

Public interface: https://levermeme.vercel.app
Source: https://github.com/jaycarson373-tech/lev-pad

## Current release status

The website can be published; accepting production funds is NOT yet authorized or verified. The default configuration rejects funding/trading. No program deployment, initialization or mainnet trade has been sent by this implementation.

Implemented: admission permits, atomic listing burn/SOL/token escrow, manual approval, owner-only available-collateral withdrawals, capped leverage engine, reserves, settlement/liquidation, oracle-verification adapter, fee distribution, funded Merkle airdrop, generated IDL/client, transaction simulation/preview/wallet approval/confirmation, operator console and managed-signer keeper runner.

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

Public configuration lives in config/launch.json; a server-only LEVERMEME_LAUNCH_CONFIG JSON override is supported. Use public program/admin/mint addresses, reviewed SBF SHA-256 and byte size, expected upgrade authority (null only for immutable), and links to actual review/acceptance reports. Report links are not automatically authenticated audit evidence.

Set SOLANA_RPC_URL in Vercel for reliable mainnet reads/simulation. SWITCHBOARD_CROSSBAR_URL selects a reviewed HTTPS Crossbar provider. The documented public default did not resolve during this release; no live provider-format/oracle acceptance is claimed.

The backend pins mainnet genesis, program loader/ProgramData PDA, deployed bytecode and upgrade authority before constructing or relaying transactions. It verifies protocol namespace, token identities, ownership and discriminators. Default template identities are rejected.

Initialize from /admin/ using the configured operator wallet. Initialization starts paused. Review recipient owners, actual burn/minimum funding and immutable per-market oracle/risk settings. Admission is permit → lister burn/fund → operator approval → additional xSOL capital → verified oracle → explicit enablement. Only enable custody/trading website flags after the release checklist passes.

## Economics and boundaries

Platform fees: 75% treasury/liquidity/insurance, 10% campaigns, 5% actual market lister, 10% buyback allocation. LeverMeme's collected-and-converted creator revenue has a separate 50/50 treasury/buyback route. A separately funded airdrop uses exactly floor(initial supply / 10).

Fee routing transfers actual xSOL; treasury/campaign/buyback recipients control funds after receipt. These are allocations, not automatically executed liquidity additions, pump.fun fee collection, swaps, buybacks or burns. Those integrations are not implemented. Admission burns and airdrop claims are implemented.

SOL + meme-token admission escrow is NOT an AMM or xSOL conversion. Listers must additionally supply real xSOL reserve capital. Markets do not pay bank interest or guaranteed returns. Fully reserved caps limit payouts to isolated collateral plus reserved profit; oracle integrity and timely operation still matter.

## Keeper

```sh
KEEPER_WALLET_ADDRESS=<public-address> npm run keeper -- --once
```

Default is simulation-only. Execution additionally requires --execute, KEEPER_REMOTE_SIGNER_URL (HTTPS), explicit KEEPER_MAX_LAMPORTS_PER_TX and KEEPER_DAILY_LAMPORTS, and optionally a server-side KEEPER_REMOTE_SIGNER_TOKEN. No local secret-key loader exists. The external signer must independently enforce wallet/program/action/SOL limits; it is not provisioned by this repository.

Use a durable .runtime/ volume and one process. Pending signatures block new submissions until resolved. The runner reserves conservative daily costs, bounds each simulated SOL debit, checks signed message equality, and persists signatures before broadcast. It is not deployed on Vercel; serverless request handlers are not durable liquidation daemons. After a crash, confirm the process is stopped and reconcile the stored signature before manually removing a stale keeper.lock. Monitoring, redundant oracle connectivity and alerting remain operational requirements.

See [onchain/README.md](onchain/README.md) and [RELEASE.md](RELEASE.md) for exact contract limits and acceptance steps.
