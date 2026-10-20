# LeverMeme admission and custody v1 — NOT DEPLOYED

This program is a tested foundation, not an operational perpetuals exchange. It has no instructions to open/close positions, settle PnL or liquidate. Never deposit production funds into it as though it supplied those functions. The public frontend does not construct or send transactions to it.

## Implemented rules

- Administrator-namespaced protocol PDA; clients must pin the intended administrator and protocol address. Initialization starts paused. A separate namespace is not an authorized LeverMeme deployment.
- One listing request per protocol/mint. Canonical pump.fun curve PDA, owner and discriminator are verified. Unsafe mint/freeze authorities and Token-2022 extensions other than metadata are rejected.
- The administrator must co-sign the exact admission transaction before the lister burns/funds it. This prevents arbitrary first-caller namespace squatting and unreviewed burns. It needs a co-signing workflow; the frontend does not currently supply one. A separate administrator-only approval records acceptance after escrow is confirmed.
- Admission burn, supplied meme tokens and SOL escrow execute atomically. Burn amount and SOL minimum must be positive. Meme-token funding must be positive; a meaningful per-market minimum/value assessment is still part of manual review.
- Only the administrator can approve a funded request. Approval does not enable leverage. Cancellation returns the recorded SOL and meme-token escrow only to its lister, even while paused; the irreversible burn and cancelled-listing tombstone remain.
- Per-wallet collateral vaults; owner signer and owner-controlled token recipient required. Pausing blocks new burns/deposits, never owner withdrawals. No administrator collateral withdrawal instruction exists.
- Operator-owned xSOL revenue routing: 75% treasury/liquidity/insurance, 10% campaigns, 5% approved market lister, 10% buyback allocation. LeverMeme's own creator revenue routes 50/50 treasury/buyback. Transfers are actual tokens, not accounting-only entries. Dust goes to the largest share (treasury for ties).
- Fee destination owners are fixed at initialization. Market royalties use the listing's recorded lister. Treasury/campaign/buyback recipients control their received tokens; this version does not restrict their later spending. Use reviewed multisig recipients, not an unreviewed hot wallet.
- One funded airdrop campaign per protocol, exactly floor(initial supply checkpoint / 10). Wallet-bound, domain-separated Merkle leaves; per-wallet claim PDA prevents repeat claims. A fixed claim window and budget cap apply. Expired unclaimed tokens may be reclaimed by the original administrator; disclose this in campaign terms.

## Build and verify without keys

Requires Node 22+, Rust, Anchor 1.1.2, Solana platform-tools. Commands run from the repository root:

```sh
npm ci
npm run build:onchain
npm run test:onchain
cd onchain
NO_DNA=1 anchor idl build --program-name levermeme --out ../idl/levermeme.json
cd ..
npm run codegen
npm test
```

`SBF_RUST_HOME` can select an existing platform-tools `rust` directory. The build helper does not generate/read keypair files and rejects SBF stack-overflow diagnostics even if Cargo reports success. The ignored SBF artifact is `onchain/target/sbf-solana-solana/release/levermeme.so`. Codama output and the Anchor-generated IDL are committed; regenerate after program changes. `clients/program.mjs` is an ESM build of the generated Kit client.

LiteSVM uses public test addresses, fixture mints/curve accounts, and disabled cryptographic signature verification. Anchor signer flags and all runtime account/CPI checks still run. These tests do not prove real-wallet signing or mainnet acceptance. Test thresholds and public addresses are not launch configuration.

`lib/airdrop.mjs` produces a manifest with claims and proofs matching the Rust hash fixture. It rejects duplicate wallets, floating-point amounts and allocations that do not sum to the funded 10% reserve. Amounts must be base-unit decimal strings/BigInt. Publish the exact manifest and review eligibility before signing campaign creation; this implementation does not decide eligibility or fetch user activity.

## Required before production funds

1. Confirm the actual LeverMeme and xSOL mints, decimals, supply checkpoint, burn requirement, minimum SOL and per-market meme liquidity, trading fee, recipient owners and administrator/upgrade-authority policy. Symbols are not identities.
2. Replace the public Anchor template program address with the secure deployment authority's chosen program identity; regenerate IDL/client and rebuild. Do not deploy the template ID. The configured provider wallet is deliberately `NO_SIGNER_CONFIGURED`.
3. Implement the derivatives engine: collateral locking, long/short exposure limits, entry/exit pricing, oracle freshness/confidence/manipulation checks, funding/fees, settlement, liquidation, bad-debt handling and a durable keeper. SOL+token escrow is not an AMM or xSOL conversion route.
4. Rework cancellation/withdrawal rules together with that engine so liquidity backing open positions cannot be removed. Current unconditional owner exits are safe only because this version never opens positions.
5. Integrate reviewed wallet transaction previews, simulation, signature rejection/expiry handling, confirmation and actual state refresh. Add an authenticated registry/indexer for public listing discovery and administrator review.
6. Integrate pump.fun creator-fee collection/conversion and buyback execution with slippage, allowlisted routes, custody and accounting controls. These routing instructions do not collect pump fees, execute swaps, burn acquired tokens or pay winners. Buyback allocations must not be represented as completed burns.
7. Independent program/economic/security review, then local/forked integration and user-controlled funded acceptance. Verify deployed bytecode, configuration, upgrade authority, monitoring and incident procedures before enabling the UI.

No deployment or initialization transaction has been sent. Never paste a private key or seed phrase into chat, this repository, environment files or Vercel. Deployment must use a user-controlled secure signer with the concrete transactions reviewed first.
