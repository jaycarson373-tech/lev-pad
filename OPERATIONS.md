# Final setup and operations

## Public setup — no keys

Open /admin/. Save a draft now and enter final public LeverMeme/xSOL mints, operator and secure deployment program address when available. The artifact selector accepts only .so files and computes their hash locally; it does not upload binaries or wallet files. Downloads/copies always leave public funding disabled.

After those public identities are final:

```sh
npm run setup -- --config /path/to/levermeme-launch.json
```

This mechanically updates the fresh program identity, rebuilds SBF/IDL/client, runs JavaScript and Rust/SVM tests, pins the resulting artifact hash/size, and builds the web app. It never generates/reads keys or sends a transaction. It refuses automatic replacement of an existing public program identity or an enabled release. A build failure leaves funding disabled. The initial registry remains empty.

Deploy only onchain/target/sbf-solana-solana/release/levermeme.so with a user-controlled secure deployment signer after reviewing the exact mainnet transaction/cost/authority. Never deploy execution_fixture.so: that is a deterministic local TEST counterpart, not real Jupiter/Pump code. Configure Vercel's LEVERMEME_LAUNCH_CONFIG with config/launch.json and redeploy. Connect the operator to initialize paused, review recipients, admit/fund markets and perform acceptance. Review RELEASE.md before changing funding flags. Report URLs alone do not prove an audit.

## Revenue execution

The operator console supports direct creator-fee collection from a native-SOL bonding vault, token-quoted bonding vault, or canonical PumpSwap pool. It binds the actual LeverMeme creator and fixes the destinations at 50/50 treasury/buyback (odd-unit dust to treasury). Only newly collected fees move; existing holdings are preserved. A creator may also own a recipient. Creator vaults aggregate every coin using that creator identity: this is explicitly disclosed, not reported as solely LeverMeme earnings. Fee-sharing/PDA creator authorities need their own supported signing workflow; an ordinary wallet cannot impersonate them.

The configured buyback owner can spend xSOL, WSOL, or native SOL through Jupiter V2 routing. Native SOL is wrapped in the same transaction. The consumer invokes only the pinned Jupiter program, enforces exact input and minimum output, rejects unrelated wallet assets/protocol accounts, then burns the entire newly acquired LeverMeme balance delta. Existing LeverMeme holdings and market collateral are not burned/spent. A failed swap, bound or burn reverts all steps. Max requested slippage is 100bps; the UI uses 50bps and rejects reported quote impact above 1%. These are routing limits, not an independently verified fair-price oracle for LeverMeme. Set conservative automation budgets and review the economic risks.

Platform fees still route 75/10/5/10 to fixed recipient owners. The 75% treasury allocation is not automatically invested into markets. Admission SOL/meme escrow is not an AMM or xSOL converter. Listers supply actual xSOL capital separately. Do not represent the treasury buffer as unlimited insurance or guaranteed growth.

## Oracle provider

The adapter validates signed spot/TWAP values, unique oracle quorum, expected feed hashes and message encoding; the on-chain Switchboard verifier enforces the pinned queue/registry, freshness and quote ownership again. The public Crossbar default failed DNS during development. No successful live LeverMeme/xSOL oracle update is claimed.

An operator may supply SWITCHBOARD_CROSSBAR_URL and an explicit SWITCHBOARD_GATEWAY_URL. Gateway mode uses the current official Gateway.fetchQuote request protocol. SWITCHBOARD_FEED_PROTOS can supply a JSON mapping from reviewed feed hash to public job-protobuf base64, avoiding a runtime Crossbar lookup. The returned signed hash must still match the immutable market settings; cached jobs or HTTP prices cannot bypass signature checks. Never embed customer API credentials in public job files. End-to-end provider/quote-program acceptance with the actual market jobs is a release requirement.

## Durable workers

scripts/keeper.mjs supports markets, creator-fees and buybacks task roles. Default is simulation-only. Explicit --execute additionally requires a managed signing endpoint, positive per-action/daily SOL caps and, for buybacks, per-action/daily input caps for one pinned asset. The configured signer must independently enforce the same or tighter policies and must NEVER broadcast on its own.

Use a separate durable state volume per wallet/role. State corruption, identity/asset changes, clock rollback and unresolved signatures stop execution rather than resetting counters. Budget is conservatively reserved before asking for a signature, including failures. The returned message/signatures are checked and the signature persisted before broadcast. Normal shutdown aborts requests and releases the exclusive lock. After a crash, reconcile the process and recorded signature before manually removing a stale lock. Expired/unknown transactions are not blindly retried.

keeper-health.mjs fails for stale/degraded workers or unresolved transactions older than two minutes. A healthy dry-run process is not an executing keeper. Alert on these failures, oracle price age, reserve coverage, signer refusals, RPC/provider errors and changed deployed artifacts/authorities. Bounded account scans stop above 2,000 accounts; scale out to a reviewed production indexer before exceeding that limit.

services/compose.yaml packages separate market, creator and buyback workers. No Docker engine was available in this development environment, so container startup is not runtime-verified. On a Docker host, supply .env.keeper through your secret manager, set role-specific public addresses, and start in dry-run:

```sh
docker compose --env-file .env.keeper -f services/compose.yaml up -d --build
```

Add --profile revenue before up for revenue workers and provide CREATOR_WALLET_ADDRESS / BUYBACK_WALLET_ADDRESS. Only after policy review and funded acceptance, set KEEPER_MODE_FLAG=--execute for a deliberately approved executing deployment. Docker health status needs external alerting; Vercel does not run these daemons.

## Concrete optional KMS signer

services/signer/index.mjs implements the HTTPS-signing contract using an existing AWS KMS Ed25519 key and ambient IAM workload credentials. It does not create a KMS key, retrieve its private material, deploy infrastructure or broadcast. The public key must match the configured Solana wallet, full key ARN is pinned, and every KMS signature is locally verified. Pure Ed25519 uses ED25519_SHA_512 with RAW message bytes, not the prehashed variant. Primary references: [AWS Sign](https://docs.aws.amazon.com/kms/latest/APIReference/API_Sign.html) and [GetPublicKey](https://docs.aws.amazon.com/kms/latest/APIReference/API_GetPublicKey.html).

```sh
npm --prefix services/signer ci --ignore-scripts
npm run signer
```

Configure the separate signing service using services/signer/signer.env.example. It requires SIGNER_ENABLE=I_ACCEPT_POLICY_BOUND_SIGNING, a strong secret access token, one explicit role/wallet and independent SOL/token budgets. Bind its IAM role to kms:GetPublicKey and kms:Sign on only the intended existing key. It listens on loopback port 8787; put it behind your authenticated HTTPS reverse proxy, never an open raw port. Keeper URL ends in /sign. Do not put this service or its secret token in public browser assets.

Before signing it independently checks mainnet bytecode/authority, namespace, generated instruction discriminators and account positions, the allowed role, wallet/payer, blockhash, native simulation costs and buyback limits. A market keeper cannot voluntarily close a user's position. Durable counters/replay cache serialize requests and survive restarts. The service holds an exclusive state lock. Public-vector/unit tests validate local Ed25519 and policy behavior, but live IAM/KMS and funded acceptance have NOT been performed. Cloud account permissions, a TLS endpoint and release approval remain operator-controlled setup, not something a wallet CA supplies.
