# LeverMeme

LeverMeme targets pump.fun-only markets up to 10× long/short, paired against xSOL. Rebranded from Lev Pad. The launch registry starts empty: no seeded tokens, positions, charts, volume or rewards.

Vercel production: https://levermeme.vercel.app (also https://lev-pad.vercel.app).

Vercel's project is named `levermeme`, so production releases use its branded production domain.

`vercel.json` runs `npm ci` and `npm run build`, serves `dist/`, and deploys read-only functions from `api/`. The production project is `levermeme` under `jaycarson373-7760s-projects`.

## Run locally

Requires Node 22+ and npm. From this directory:

```sh
npm ci
npm run build
npm test
node scripts/browser-check.mjs
```

Routes: `/`, `/trade/`, `/list-token/`, `/portfolio/`, `/ecosystem/`. Source is in `web/`; generated output is in `dist/`. A plain static server does not serve the Vercel API functions. Browser tests use Playwright; install Chromium using `npx playwright install chromium` if needed. Screenshots are written to the workspace `outputs/` directory, outside this checkout.

For Vercel, import the repository root. Set `SOLANA_RPC_URL` as a server-only environment variable for production-grade mainnet reads. The fallback public RPC is rate-limited and may reject shared hosting requests. API failures appear as errors, never invented verification or balances. No paid RPC credential is bundled in the client.

## Current functionality

Empty market terminal, long/short selection, exact integer-based 1–10× sizing, and three-step listing drafts. Listing verifies the mint, mainnet genesis, pump.fun curve PDA, owner and discriminator. Wallet connection uses real Wallet Standard discovery on `solana:mainnet`; the portfolio can read finalized wallet SOL balances. Drafts are saved on the current device and are not submitted listings.

The ecosystem view separates insurance, user rewards, Meme Bank reserves and buybacks/burns. Fee splits, eligibility, treasury permissions and activation are pending configuration. No financial returns are promised.

## Production trading status

This is a public pre-launch interface. Trading, collateral deposits/withdrawals, burns, market funding and reward claims are unavailable. No transaction instructions are constructed or sent. No market charts, collateral balances, positions, or trade histories are fabricated. Account reads and passing tests do not constitute a security audit or full mainnet acceptance.

Real trading still requires verified LeverMeme and xSOL mints, a deployed derivatives program and authenticated market registry, funded vaults, burn requirements, minimum liquidity, fee policies/recipients, live pricing, collateral/settlement handling and tested liquidation rules. Supplying SOL plus meme tokens while quoting in xSOL requires defined conversion/vault rules. Pump.fun origin alone does not establish eligibility for 10× exposure.

## Mainnet release checks

Copy `mainnet.config.example.json` to `mainnet.config.json` and populate verified public addresses. Set `SOLANA_RPC_URL` using your local environment or hosting secret manager. Never paste keys into source.

```sh
node --test scripts/mainnet-preflight.test.mjs
node scripts/mainnet-preflight.mjs mainnet.config.json
```

Preflight rejects missing configuration, wrong networks, invalid mint/vault accounts, and unexpected owners. Account checks do not prove market bindings, oracle safety, solvency, or launch readiness; the report retains those explicit release requirements. The command exits nonzero until full launch acceptance has a separate implementation. See `PROJECT.md` for the saved scope and release checkpoint.

## Files

- `web/`: LeverMeme page, style, icon and wallet client source
- `api/` and `lib/`: read-only mainnet API handlers and verification
- `dist/`: generated multi-route website and bundled assets
- `tests/` and `scripts/`: build, browser and account validation checks
- `.openai/hosting.json`: existing Sites deployment identity

Legacy artwork is retained but unused. The new design uses original UI styling and a simple vector mark; it does not copy the reference site's source or assets.
