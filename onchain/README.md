# LeverMeme v3 — undeployed

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
- Actual platform trading fees route 75/10/5/10. Direct creator fee claims from native/token bonding vaults and canonical PumpSwap pools route only the newly collected amount 50/50 to fixed treasury/buyback owners. Creator may also own a recipient. Vaults aggregate all coins using that creator identity, not solely LeverMeme. A separate revenue ledger records collected assets and executed burns. General spending by recipient wallets is not constrained.
- Buyback input is owned by the fixed buyback wallet and limited to xSOL/WSOL. Native SOL wrapping can precede the swap in the same transaction. Only the pinned Jupiter program is invoked; exact input, minimum acquired output, unchanged pre-burn mint supply, unchanged native authority balance during swap, and protected existing LeverMeme holdings are enforced. Newly acquired tokens are burned before success. Unrelated wallet assets, protocol-owned accounts and extra signers are rejected. Failure rolls back swap and burn together.
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

The execution_fixture program is a deterministic TEST-ONLY CPI counterpart loaded under external program IDs inside LiteSVM. It is not Pump or Jupiter source and does not demonstrate their live acceptance. Never deploy execution_fixture.so. Its purpose is testing actual token transfers, balance/supply invariants and whole-transaction rollback at the consumer boundary.

Passing tests/static checks are not independent audit, economic validation, production liquidity, live keeper operation or mainnet wallet acceptance.

## Unimplemented integrations / release blockers

Creator-fee collection and bounded swap/burn execution are implemented, but actual external-program/provider acceptance for the final assets is not complete. No SOL/base admission-escrow conversion, AMM or automatic treasury investment is implemented; listers provide separate real xSOL capital. Durable worker packaging and a concrete KMS signing service are included but not deployed/configured; no Docker engine or live AWS account acceptance was available. No production indexer beyond bounded scans (2,000 accounts per query). Default public Crossbar failed DNS; explicit gateway/cached public job support is implemented, with actual oracle acceptance still required.

See ../RELEASE.md. No mainnet deployment/initialization/write has been sent. Do not send funds to the template.
