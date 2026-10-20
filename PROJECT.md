# LeverMeme release checkpoint

Confirmed product: long/short markets up to 10× for pump.fun tokens on Solana mainnet, paired against xSOL (itself on pump.fun). Brand: LeverMeme. Listing requires burning LeverMeme and supplying SOL plus the meme token. Start with zero listings. Design: playful mint-green branding and a dense professional trading terminal. Robinhood Chain is out of scope.

Source: https://github.com/jaycarson373-tech/lev-pad
Public interface: https://levermeme.vercel.app (also https://lev-pad.vercel.app)

The interface is pre-launch with real Wallet Standard connection and read-only mainnet API functions. No trading program, funded collateral vault, oracle configuration, or actual positions are implemented. Do not mark mainnet trading ready based on hosting or compilation.

Ecosystem interpretation awaiting confirmation: fees fund insurance, user rewards, Meme Bank reserves and LeverMeme buybacks/burns. Percentages, amounts, addresses and claims are not invented or enabled. No user funds are accepted.

October 20 verification: build and 11 unit/account tests passed. Local and public-production browser checks passed for 10× sizing, direction selection, no-wallet detection, deposit gating, invalid mint rejection, device-local listing drafts, ecosystem pages, navigation and 390px mobile overflow. Listing-draft success in browser tests uses an explicitly mocked verification response. Separately, the deployed read-only API verified the reference token `BM2k8mJUbMthHoioykyUm2NjMrXvLBYhoXruwYLpump` on mainnet at finalized slot 459282824; this did not list that token. Mainnet genesis and SOL balance reads also succeeded in production. No burn, deposit, withdrawal or leveraged trade was submitted or funded-tested.

The xSOL mint must be confirmed from the intended token page; a symbol search is insufficient. No candidate address is configured automatically.

Pump primary documentation checked October 19, 2026:
- https://github.com/pump-fun/pump-public-docs
- https://github.com/pump-fun/pump-public-docs/blob/main/docs/instructions/CREATE_WITH_PUMP_COIN_QUOTE.md
- https://github.com/pump-fun/pump-public-docs/blob/main/docs/PUMP_SWAP_README.md

PumpSwap is a spot AMM. Its quote-asset support does not supply a perpetuals engine. Current docs identify effective quote reserves as actual quote-vault balance plus signed virtual quote reserves. A derivatives mark must additionally resist manipulation and stale prices.

Release needs a verified xSOL mint, deployed derivatives program and interface/IDL, authenticated market configuration linking the oracle and vault, liquidation service, liquidity, RPC endpoint, wallet integration, simulation coverage, and funded user acceptance covering open/close/withdraw and liquidation. Preflight tooling checks basic account identity only; it is not an economic or security audit.
