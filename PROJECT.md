# Lev Pad release checkpoint

Confirmed product: leveraged long/short markets for pump.fun tokens on Solana mainnet, paired against xSOL (itself on pump.fun). Preserve the existing visual design. Robinhood Chain is out of scope.

Source: https://github.com/jaycarson373-tech/lev-pad
Public interface: https://lev-pad-live.sufficientlev.chatgpt.site

The existing interface remains a demo. No trading program, funded collateral vault, oracle configuration, or actual positions are implemented in this repository. Do not mark mainnet trading ready based on hosting or compilation.

The xSOL mint must be confirmed from the intended token page; a symbol search is insufficient. No candidate address is configured automatically.

Pump primary documentation checked October 19, 2026:
- https://github.com/pump-fun/pump-public-docs
- https://github.com/pump-fun/pump-public-docs/blob/main/docs/instructions/CREATE_WITH_PUMP_COIN_QUOTE.md
- https://github.com/pump-fun/pump-public-docs/blob/main/docs/PUMP_SWAP_README.md

PumpSwap is a spot AMM. Its quote-asset support does not supply a perpetuals engine. Current docs identify effective quote reserves as actual quote-vault balance plus signed virtual quote reserves. A derivatives mark must additionally resist manipulation and stale prices.

Release needs a verified xSOL mint, deployed derivatives program and interface/IDL, authenticated market configuration linking the oracle and vault, liquidation service, liquidity, RPC endpoint, wallet integration, simulation coverage, and funded user acceptance covering open/close/withdraw and liquidation. Preflight tooling checks basic account identity only; it is not an economic or security audit.
