# LeverMeme v2 — undeployed

Anchor implementation of admission, segregated custody and fully-reserved capped leverage. The committed identity is a public template for local tests only. It must be replaced and the IDL/client/artifact rebuilt under the secure deployment's real program identity.

## Implemented rules

- Administrator-namespaced protocol; initialization starts paused. Both LeverMeme/xSOL and listing mints require canonical pump.fun origin and safe token authority/extension checks.
- Wallet/mint-bound expiring administrator permit before any irreversible admission burn. Request atomically burns LeverMeme and escrows SOL plus meme tokens. Separate approval is required; one lifetime listing per mint prevents takeover/replay.
- Registered market escrow cannot be cancelled. Empty, disabled markets may be retired; only then can the original lister reclaim admission escrow. Burns never reverse.
- Per-wallet available collateral and separate locked accounting. Only owner-signed withdrawals can move available collateral. Pausing blocks new funding/positions but preserves exits and settlement.
- Immutable market risk/oracle settings. Max 10×, bounded OI/notional, minimum margin/liquidity, spread, maintenance, liquidation bounty and maximum profit. Every position reserves its entire possible profit from real xSOL market capital.
- Long entry ask / exit bid; shorts reversed. Profit caps at the lesser of configured margin multiple and notional, before fees. Loss cannot exceed isolated collateral (opening fee is additional). No perpetual funding payments. No debt/socialized loss accounting.
- Close by owner, permissionless unhealthy liquidation, permissionless profit-cap settlement, or permissionless last-verified-mark settlement after an immutable 1–24h oracle-outage delay. The last-mark outage rule is an explicit economic risk, not a guarantee of fair current value.
- Pinned Switchboard queue and separate spot/TWAP feed hashes, quote-program ownership, SDK quote verifier, fresh slot hashes, oracle quorum/unique indices, positive prices, bounded deviation and monotonic cached slot. HTTP prices alone are never trusted.
- Reserved profit is unavailable for lister withdrawal. Vault balances must cover market capital, locked user collateral and accrued fees.
- Actual platform trading fees route 75/10/5/10. Own creator revenue routes 50/50 only after external collection/conversion. Fixed owner recipients; creator is the recorded market lister. Received fund spending is NOT constrained by this program.
- Exactly floor(initial supply checkpoint / 10) funded airdrop, domain-separated wallet/index/amount Merkle proofs, per-wallet replay protection, claim window and administrator reclaim of unclaimed funds after expiry.

## Build without keys

From repository root:

```sh
npm run build:onchain
npm run test:onchain
cd onchain
NO_DNA=1 anchor idl build --program-name levermeme --out ../idl/levermeme.json
cd ..
npm run codegen
npm test
```

SBF_RUST_HOME may select an installed platform-tools rust directory. Build helper rejects stack violations even if Cargo exits successfully and never creates keypair files. Artifact: onchain/target/sbf-solana-solana/release/levermeme.so (ignored). Provider wallet is intentionally NO_SIGNER_CONFIGURED.

Codama generates clients/generated/ from the Anchor IDL, then clients/program.mjs. Regenerate after every ABI/program identity change. No hand-maintained instruction serialization.

## Test limitations

LiteSVM uses public fixture addresses and disabled cryptographic transaction-signature verification. Signer flags, account/CPI constraints and runtime checks still run. Engine tests inject explicitly local cached prices: they do NOT demonstrate acceptance of real signed mainnet oracle quotes. JavaScript oracle tests cover public cryptographic vectors and rejection paths, not provider integration success.

Passing tests/static checks are not independent audit, economic validation, production liquidity, live keeper operation or mainnet wallet acceptance.

## Unimplemented integrations / release blockers

No pump.fun creator-fee collection, SOL/base-to-xSOL conversion, AMM, buyback swaps or acquired-token burn executor. Admission escrow is distinct from xSOL position capital. No deployed remote signer or durable keeper service; no production indexer beyond bounded account scans (2,000 accounts per query). No live provider acceptance: default public Crossbar hostname failed DNS during this release.

See ../RELEASE.md. No mainnet deployment/initialization/write has been sent. Do not send funds to the template.
