# LeverMeme release checkpoint

Confirmed product: long/short markets up to 10× for pump.fun tokens on Solana mainnet, paired against xSOL (itself on pump.fun). Brand: LeverMeme. Listing requires burning LeverMeme and supplying SOL plus the meme token. Start with zero listings. Design: playful mint-green branding and a dense professional trading terminal. Robinhood Chain is out of scope.

Source: https://github.com/jaycarson373-tech/lev-pad
Public interface: https://levermeme.vercel.app (also https://lev-pad.vercel.app)

The interface is pre-launch with real Wallet Standard connection and read-only mainnet API functions. No trading program, funded collateral vault, oracle configuration, or actual positions are implemented. Do not mark mainnet trading ready based on hosting or compilation.

Latest working economics: platform fees split 75% liquidity/insurance, 10% campaigns, 5% approved market lister, 10% buyback/burn allocation. Own token creator revenue splits 50% treasury/insurance and 50% buyback/burn allocation. Separate 10% supply airdrop. Manual admission review. Burn amount, minimum funding, recipients and actual token identities remain unconfigured. No user funds are accepted.

October 20 implementation update: `onchain/` contains an undeployed Anchor admission/custody/revenue/airdrop program, generated `idl/` and `clients/`, fixed-point risk helpers, and LiteSVM adversarial integration tests. It deliberately has no derivatives execution/settlement/liquidation instructions. The public UI remains fail-closed. See `onchain/README.md`; keys alone will not complete the exchange.

Latest local verification: 21 JavaScript tests, 10 Rust unit tests and 7 LiteSVM tests passed; responsive desktop/mobile browser checks passed. SBF release build passed without stack violations. Static program checker reported zero findings (not an audit). Built artifact SHA-256: `fc2598a674cf93f7a77b426b915f1f53560d1883df6afa41971ad957763e94bc`. This artifact uses a public template identity for local tests only and must be rebuilt under a real approved identity before deployment. No program was deployed and no mainnet write was sent.

October 20 verification: build and 11 unit/account tests passed. Local and public-production browser checks passed for 10× sizing, direction selection, no-wallet detection, deposit gating, invalid mint rejection, device-local listing drafts, ecosystem pages, navigation and 390px mobile overflow. Listing-draft success in browser tests uses an explicitly mocked verification response. Separately, the deployed read-only API verified the reference token `BM2k8mJUbMthHoioykyUm2NjMrXvLBYhoXruwYLpump` on mainnet at finalized slot 459282824; this did not list that token. Mainnet genesis and SOL balance reads also succeeded in production. No burn, deposit, withdrawal or leveraged trade was submitted or funded-tested.

The xSOL mint must be confirmed from the intended token page; a symbol search is insufficient. No candidate address is configured automatically.

Pump primary documentation checked October 19, 2026:
- https://github.com/pump-fun/pump-public-docs
- https://github.com/pump-fun/pump-public-docs/blob/main/docs/instructions/CREATE_WITH_PUMP_COIN_QUOTE.md
- https://github.com/pump-fun/pump-public-docs/blob/main/docs/PUMP_SWAP_README.md

PumpSwap is a spot AMM. Its quote-asset support does not supply a perpetuals engine. Current docs identify effective quote reserves as actual quote-vault balance plus signed virtual quote reserves. A derivatives mark must additionally resist manipulation and stale prices.

Release needs a verified xSOL mint, deployed derivatives program and interface/IDL, authenticated market configuration linking the oracle and vault, liquidation service, liquidity, RPC endpoint, wallet integration, simulation coverage, and funded user acceptance covering open/close/withdraw and liquidation. Preflight tooling checks basic account identity only; it is not an economic or security audit.
