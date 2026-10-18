# Lev Pad

Public PONS market interface concept: landing page, trading terminal, listing preview, and portfolio.

Live site: https://lev-pad-live.sufficientlev.chatgpt.site

## Run locally

Requires Python 3. From this directory:

```sh
python3 -m http.server 8080 --directory dist
```

Open http://localhost:8080. Routes: `/`, `/trade/`, `/list-token/`, `/portfolio/`.
No compilation, dependencies, or secrets are required. Deploy `dist/` on a static host with directory index support.

## Current functionality

Market search, direction and multiplier controls, illustrative position calculations, and listing preview controls run in the browser.

## Production trading status

This release is a public interface demo. Market data, balances, positions, wallet connection, deposits, withdrawals, and listing lookup are simulated. The chart is illustrative. No signatures are requested, transactions submitted, or funds moved. Listing previews are not persisted. Options and watchlist views are not implemented.

Real trading requires a specified Solana program or trading provider, the verified PONS mint and market addresses, wallet integration, live pricing, persistent positions, collateral and settlement handling, and tested liquidation rules. None of those services or contract addresses have been supplied for this project.

## Files

- `dist/index.html`: landing page
- `dist/trade/index.html`: demo terminal
- `dist/list-token/index.html`: listing preview
- `dist/portfolio/index.html`: sample portfolio
- `dist/assets/`: shared styles, interaction code, original generated hero artwork
- `.openai/hosting.json`: existing Sites deployment identity

The original generated artwork is included; this repository does not include the reference site's source or assets.
