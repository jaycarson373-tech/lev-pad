# Mainnet activation checklist

The public website is separate from a funded exchange. Do not bypass these gates.

1. Confirm full LeverMeme and xSOL mint addresses from the intended pump.fun pages; validate decimals, supply, disabled mint/freeze authorities and supported extensions. Confirm actual operator, upgrade policy and reviewed treasury/campaign/buyback recipient owners.
2. Choose the deployment's public program identity using a user-controlled secure signer. Update declare_id and Anchor configuration, regenerate IDL/client, rebuild and rerun all checks. Review the exact program deployment transaction, costs and authority in the secure signing workflow. Never upload its key to this website.
3. Pin deployed SBF SHA-256, byte size and upgrade authority in launch config. npm run check:release must verify program identity. Pause on any unexplained bytecode/authority change.
4. Independently review program security AND economics, including capped payouts, manipulated/stale markets, TWAP job independence, xSOL depeg, thin markets and last-mark outage settlement. A report URL or static checker is not review evidence.
5. Prove real provider acceptance: correct live Crossbar response format, quote-program CPI, oracle registry, queue and spot/TWAP jobs. Demonstrate substituted signer/feed/queue, stale/future prices, deviation and quorum failures on a controlled test/fork environment. Current provider success is unverified.
6. Initialize paused with concrete burn/minimum funding/fee values and recipient owners. Verify configuration on chain. Use reviewed multisig operators/recipients where appropriate.
7. Permit one test listing; user reviews irreversible burn and escrow. Approve funded listing. Supply additional xSOL market capital. Confirm every reserve and token account binding.
8. Deploy a reliable managed signer plus durable keeper outside Vercel, bounded spending, durable pending-signature storage and monitoring. Measure oracle/settlement latency under load and failover. Monitor fresh-price age, capital/reserves/fees, failed simulations, queue signer changes, pending signatures and RPC/provider health. Demonstrate pause and recover while preserving exits.
9. Funded acceptance with explicit wallet approval: deposit → long/short → owner close → withdraw; liquidation; profit cap; reserve withdrawal rejection; outage settlement; pause; fee distribution to all actual owners; listing retirement/escrow return; funded airdrop claim/replay/expiry. Check balances and fees from confirmed transactions, not only UI counters.
10. Publish actual review/acceptance receipts, profit-cap/outage/fees/risk disclosures, campaign eligibility and recipient addresses. Set production RPC and valid public configuration; enable website gates only after operator release approval. Start with conservative limits, monitor continuously, and keep incident response available.

V3 implements direct creator-fee collection and bounded atomic Jupiter buyback/burn, with optional policy-controlled worker execution. Funded acceptance must cover the actual Pump/PumpSwap/Jupiter programs, recipient aliasing, input/output bounds, mint supply changes and rollback. Live IAM/KMS acceptance and durable worker deployment are separate requirements. Do not advertise automatic treasury investment or SOL/base escrow conversion into xSOL capital: those functions are not implemented.

## Incident response

Pause new positions/funding with the configured admin wallet. Do not disable owner exits or settlement. Reconcile confirmed signatures and vault liabilities before retries; never blindly resend an unresolved transaction. Stop keeper execution on identity/oracle/signing-policy mismatch. Retain signatures, logs and exact deployed artifact. Publish accurate incident status. Restore only after verified state, liquidity and oracle acceptance are recovered.
