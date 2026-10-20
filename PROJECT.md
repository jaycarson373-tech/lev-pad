# LeverMeme checkpoint — October 20, 2026

Source: https://github.com/jaycarson373-tech/lev-pad
Public interface: https://levermeme.vercel.app (alias https://lev-pad.vercel.app). Vercel project: levermeme in jaycarson373-7760s-projects.

Product: pump.fun-origin Solana meme markets against verified xSOL; isolated long/short up to 10× with fully-reserved capped profit, not uncapped perpetuals. Empty initial registry. Listing permit, LeverMeme burn, SOL/meme escrow, manual approval, additional xSOL capital, oracle and explicit activation. Not Robinhood Chain.

Implemented v2: onchain engine/custody/admission/revenue/airdrop; Anchor IDL and Codama Kit client; verified deployment/account reads; simulated wallet-approved transaction API/UI; actual-state terminal/portfolio/operator console; signed oracle adapter; bounded managed-signer keeper runner; JavaScript/Rust/LiteSVM/browser tests.

Economics: platform 75% treasury/insurance, 10% campaigns, 5% lister, 10% buyback allocation. Own collected/converted creator fees 50/50 treasury/buyback. Separate funded 10% supply airdrop. Allocations are not automated buybacks or liquidity investment. Pump fee collection, swaps/conversion and buyback/burn execution remain unimplemented.

Default config remains unconfigured and funding/trading disabled. No program, protocol, live oracle acceptance, deployed keeper or funded trade has been created. Real identities, secure deployment, liquidity, independent review and funded acceptance are still required. User will supply final public token/wallet identities; never request or store their private key.

Current tests include local price fixtures (not real oracle success), public signature vectors, safe simulation/relay, reserved profit/custody invariants, liquidation/cap/outage, owner/replay checks, fee/airdrop accounting and prelaunch desktop/mobile routes. Static checker reports zero findings across lib/engine/math, not an audit. See README.md, onchain/README.md and RELEASE.md for exact operational limits.

Do not call this mainnet trading ready merely because Vercel is live, reports are linked or keys are added. config/launch.json rejects the committed template program; new chosen identity requires source/IDL/client/artifact rebuild and hash pinning.
