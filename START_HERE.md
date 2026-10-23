# LeverMeme: operator, funding, environments, test

Website: https://levermeme.vercel.app · Operator console: https://levermeme.vercel.app/admin/

## 1. Put the operator here

Connect your operator wallet in `/admin/` and click **Use connected operator wallet**. This sets the public `admin` address in the downloadable launch file. Enter the final LeverMeme mint, xSOL mint, deployment program address and intended upgrade authority. Use public addresses only. Wallets and your managed deployment signer retain their keys; there is no private-key environment variable.

Download `levermeme-launch.json`, then run from the repository root:

```sh
npm ci
npm run setup -- --config /absolute/path/to/levermeme-launch.json
npm run estimate:deployment
```

`setup` builds the final program identity, regenerates its client, tests it and writes the exact digest/size to `config/launch.json`. These commands do not deploy, sign, unpause or send funds. The estimator uses your own server-side `SOLANA_RPC_URL` when provided.

## 2. Fund these public addresses

| Address | Initial funding | Purpose |
| --- | --- | --- |
| Your deployment fee payer | **10.1 SOL suggested wallet headroom** | Current exact-size program storage is **4.948494040 SOL**, initialization storage **0.003114040 SOL**. Temporary buffer headroom is not another permanent fee. Transactions/retries are extra; re-quote after the final identity rebuild. If admin is a separate wallet, fund its own initialization/operation fees too. |
| `KEEPER_WALLET_ADDRESS` = `SIGNER_WALLET_ADDRESS` | **0.1 SOL for a small controlled test** | Keeper gas/account creation, not liquidity or a promise of continuous operating time. Approve caps after inspecting simulations and monitor/refill the balance. Keep it separate from admin. |
| Listing wallet | Configured LeverMeme burn + SOL/meme escrow + account/network fees | The operator selects and reviews admission terms at initialization; the wallet review shows the actual amounts before signing. |
| Listing wallet's xSOL balance | Additional xSOL reserve capital | Must meet the market's reviewed `minimumLiquidity` and reserved-profit limits. Admission SOL/meme escrow is not converted into this reserve. |

Read-only mainnet rent quote rechecked October 23, 2026 for the 973,776-byte stripped candidate. 10.1 SOL is a planning cushion, not a spending authorization or guaranteed deployment ceiling. Final size, signer workflow, retry count and priority fees determine the actual debit. See [LOW_COST_LAUNCH.md](LOW_COST_LAUNCH.md) for storage breakdown and recurring infrastructure costs.

Deploy **only** `onchain/target/sbf-solana-solana/release/levermeme.so` through your user-controlled secure deployment signing workflow, using the final byte size as maximum capacity. Review mainnet, program identity, fee payer, upgrade authority and maximum debit before approving. Never deploy `execution_fixture.so` or a diagnostic `.unstripped` file. The keeper signer intentionally cannot deploy programs or act as admin.

## 3. Put environments in these three places

All three services must receive the same final `config/launch.json` as `LEVERMEME_LAUNCH_CONFIG` (public JSON, not a file path). The final config already contains the program/mint/operator addresses; do not create competing address variables.

| Where | Template | Settings |
| --- | --- | --- |
| **Vercel → project `levermeme` → Settings → Environment Variables → Production** | `.env.example` | `SOLANA_RPC_URL`, `LEVERMEME_LAUNCH_CONFIG`, `SWITCHBOARD_GATEWAY_URL`, plus `SWITCHBOARD_CROSSBAR_URL` **or** `SWITCHBOARD_FEED_PROTOS`. Redeploy after saving. |
| **Always-on worker host → repository root `.env.keeper`**, populated through its secret manager | `.env.keeper.example` | Same public config/RPC/oracle settings; `KEEPER_WALLET_ADDRESS`, mode/cadence/tasks. Execution also needs `KEEPER_REMOTE_SIGNER_URL` ending `/sign`, `KEEPER_REMOTE_SIGNER_TOKEN` and approved SOL budgets. Start `markets` only in `--dry-run`. |
| **Signing host → repository root `.env.signer`**, populated through its secret manager | `.env.signer.example` | Public config/RPC; `SIGNER_WALLET_ADDRESS`, `SIGNER_ROLE=markets`, approved budgets, strong `SIGNER_AUTH_TOKEN`, full existing `KMS_KEY_ARN` and matching `AWS_REGION`. Scoped ambient IAM permits only `kms:GetPublicKey` and `kms:Sign` on that key. Explicit startup opt-in is in the template. |

`SIGNER_AUTH_TOKEN` and `KEEPER_REMOTE_SIGNER_TOKEN` must match. Keep tokens, credential-bearing RPC URLs and IAM access server-side. Do not use `NEXT_PUBLIC_`/`VITE_` prefixes or commit actual `.env` files. Use the project's own production RPC, never the shared local-development proxy. Vercel serves the website/API; it does not start these durable workers or the separate signer.

## 4. Validate and start simulation-only

With Node 22 and dependencies installed, validate each file on its owning host:

```sh
node --env-file=.env.local scripts/check-env.mjs web
node --env-file=.env.keeper scripts/check-env.mjs keeper
node --env-file=.env.signer scripts/check-env.mjs signer
```

`.env.local` is the optional local equivalent of the Vercel settings. Reports show names/status only, never values. Exit 0 means configuration shapes pass, **not** that an oracle, KMS policy or funded exchange has been verified. The signer check requires deliberate service-start opt-in, while the keeper may remain dry-run.

After attaching IAM, persistent volumes, a host-local authenticated HTTPS reverse proxy for `/sign` and monitoring, start on the appropriate hosts:

```sh
docker compose --env-file .env.signer -f services/signing.compose.yaml up -d --build
docker compose --env-file .env.keeper -f services/compose.yaml up -d --build
```

Keep `KEEPER_MODE_FLAG=--dry-run` initially. Per-action and daily budgets are positive integer lamports, independently enforced by keeper and signer. Daily accounting reserves the entire per-action cap for each signing attempt, including failures; `daily / per-action` is the maximum attempt count. Choose real operating budgets from measured usage, not an arbitrary “unlimited” default. Preserve durable state volumes and initialized markers across deployments.

## 5. Test listing → royalty → withdrawal

1. After deployment, connect admin in `/admin/` and **Initialize the paused protocol**. Review burn, minimum escrow, trading fee and the three immutable recipient owners. Website checks must verify mainnet bytecode/authority and mint identities.
2. Run automated verification: `npm test`, `npm run test:onchain`, `npm run build`, `npm run test:browser`. The SVM suite executes actual listing/custody/fee instructions with isolated fixtures, including rejection of a substituted creator. CI runs these checks too.
3. Complete the review and controlled funded acceptance in [RELEASE.md](RELEASE.md), with explicit wallet approvals and real reviewed oracle jobs. Public gates intentionally require real review/acceptance evidence; do not insert fake report URLs to get past them. A website flag is not an on-chain access restriction, and unpausing a permissionless program is a real release decision.
4. For the approved acceptance/release, admin issues the mint-and-wallet-specific permit. The lister reviews the permanent LeverMeme burn plus SOL/token escrow at `/list-token/`. Admin approves the funded request and configures its disabled market; lister funds the separate xSOL reserve. Verify the signed spot/TWAP oracle, then explicitly enable the reviewed market.
5. Test a small deposit, long, close, short, close and withdrawal with wallet signatures. Use **Distribute fees** in `/portfolio/` or `/admin/`; verify confirmed recipient token balances and signatures. Reconcile unknown/pending signatures before retrying.
6. Confirm the approved **lister** receives **5% of platform trading fees**, not 5% of volume or a guaranteed yield. The remaining routing is 75% treasury, 10% user campaigns and 10% buyback allocation. A token developer is not automatically the market lister. LeverMeme's own pump.fun creator fees are a separate 50/50 treasury/buyback flow. Small integer dust follows contract rounding.
7. After real oracle/signer/funded acceptance and operator release approval, deliberately configure the reviewed public gates and keeper `--execute`, redeploy the affected services, and repeat balance/fee/health checks. Preserve pause/exits, budget limits and all existing financial policies.

No mainnet transactions were executed by preparing this guide. Lending stays disabled and is not included in this program's deployment cost.
