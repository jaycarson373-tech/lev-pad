import { createClient } from "@solana/kit";
import { walletSigner } from "@solana/kit-plugin-wallet";
import { renderEcosystem } from './ecosystem.js';
import { renderLending,bindLending } from './lending.js';
import { renderLiveTrade,renderLivePortfolio,renderAdmin,createProtocolController,units as formatUnits } from './live.js';
import {
  positionSize,
  positiveDecimal,
  escapeHtml as esc,
  routeFor,
} from "./domain.js";

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const walletClient = createClient().use(
  walletSigner({ chain: "solana:mainnet", autoConnect: false }),
);
const walletDialog = $("#wallet-dialog");
const actionDialog = $("#action-dialog");
const state = {
  status: null,
  address: null,
  balance: null,
  view: routeFor(location.pathname),
  side: "Long",
  leverage: 10,
  margin: "",
  step: 1,
  verified: null,
  draft: {},
  loading: false,
  runtime: null,
};
let protocolController;
let notification;
let balanceRequest = 0;

function toast(message) {
  $("#toast").textContent = message;
  $("#toast").classList.add("show");
  clearTimeout(notification);
  notification = setTimeout(() => $("#toast").classList.remove("show"), 4500);
}
function draftLoad() {
  try {
    state.draft = JSON.parse(
      localStorage.getItem("levermeme:list-draft") || "{}",
    );
  } catch {
    state.draft = {};
  }
}
draftLoad();
function saveDraft() {
  try {
    localStorage.setItem("levermeme:list-draft", JSON.stringify(state.draft));
    toast("Listing draft saved on this device.");
  } catch {
    toast("Storage is unavailable. Keep this page open to retain your draft.");
  }
}
function short(address) {
  return address.slice(0, 4) + "…" + address.slice(-4);
}
function nav() {
  $$("[data-nav]").forEach((a) => {
    a.classList.toggle("active", a.dataset.nav === state.view);
    if (a.dataset.nav === state.view) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
}
const callout = () =>
  `<section class="launch-callout"><div><h2>Bring your market to LeverMeme.</h2><p>Review token eligibility, the admission burn and funded trading reserves.</p></div><a class="button" href="/list-token/">Listing requirements</a></section>`;
const trade =
  () => `<div class="page-width"><section class="intro"><div><div class="intro-top"><span class="label">MEME COIN LEVERAGE ON SOLANA</span><span class="tag green">pump.fun markets</span></div><h1>Leveraged trading.<br><span>For pump.fun coins.</span></h1><p>Go long or short with up to 10× isolated leverage. Trade approved pump.fun markets against xSOL, with fully reserved, capped profits.</p></div><div class="intro-badge"><div class="ten">10<span>×</span></div><p><b>Isolated leverage.</b>Long or short.<br>Defined market limits.</p></div></section>
<section class="stats" aria-label="Market statistics"><div class="stat"><span>LISTED MEMES</span><strong>0</strong></div><div class="stat"><span>OPEN INTEREST</span><strong>0<small>xSOL</small></strong></div><div class="stat"><span>LIQUIDITY SUPPLIED</span><strong>0<small>SOL</small></strong></div><div class="stat"><span>LEVERMEME BURNED</span><strong>0<small>LM</small></strong></div></section>
<section class="desk" aria-label="Trading terminal"><aside class="market-pane"><div class="pane-head">Markets <span class="count">0</span></div><div class="search-box"><span>⌕</span><input id="market-search" placeholder="Search memes…" aria-label="Search memes" type="search"></div><div class="market-filter"><button class="filter active" data-filter="all" aria-pressed="true">All memes</button><button class="filter" data-filter="new" aria-pressed="false">New</button></div><div class="market-empty"><strong id="search-message">No markets listed yet.</strong><p>Review the admission requirements to request a market.</p><a class="small-link" href="/list-token/">List a meme <span>↗</span></a></div></aside>
<div class="chart-pane"><div class="chart-top"><span class="token-placeholder">?</span><div><b>Select a market</b><small>PUMP.FUN / XSOL</small></div><div class="chart-options"><span>15m</span><span>1h</span><span>4h</span><span>1d</span><span>⌗</span></div></div><div class="empty-chart"><div class="empty-center"><div class="capsule-icon" aria-hidden="true">↗</div><span class="label">MARKET AVAILABILITY</span><h2>No markets open yet.</h2><p>Trading opens after contracts, reserves<br>and independent price feeds are verified.</p><a class="button mint" href="/list-token/">Review listing requirements <span>+</span></a></div><span class="chart-watermark">LeverMeme</span></div><div class="positions"><div class="position-tabs"><button class="active" data-position-tab="positions" aria-pressed="true">Positions <span class="muted">0</span></button><button data-position-tab="orders" aria-pressed="false">Open orders <span class="muted">0</span></button><button data-position-tab="history" aria-pressed="false">Trade history</button></div><div class="position-empty"><span id="position-empty-text">No open positions.</span><a href="/portfolio/" class="green">View portfolio ↗</a></div></div><div class="account-strip"><span>Available <b>— xSOL</b></span><div><button data-action="deposit">Deposit</button><button data-action="withdraw">Withdraw</button></div></div></div>
<aside class="order-pane"><div class="order-heading"><span>Place a trade</span><span class="tag">ISOLATED</span></div><div class="side-switch" aria-label="Trade direction"><button data-side="Long" class="${state.side === "Long" ? "active" : ""}" aria-pressed="${state.side === "Long"}">↗ Long</button><button data-side="Short" class="short ${state.side === "Short" ? "active" : ""}" aria-pressed="${state.side === "Short"}">↘ Short</button></div><div class="field-header"><label for="leverage">Leverage</label><strong id="leverage-value">${state.leverage}×</strong></div><input type="range" id="leverage" min="1" max="10" step="1" value="${state.leverage}"><div class="range-labels"><span>1×</span><span>5×</span><span>10×</span></div><div class="field-header"><label for="margin">Margin</label><span>Available: —</span></div><div class="amount-wrap"><input id="margin" inputmode="decimal" placeholder="0.00" value="${esc(state.margin)}" autocomplete="off"><span>xSOL</span></div><p class="amount-note">Quotes appear when a funded market is selected.</p><div class="order-lines"><div><span>Position size</span><b id="position-size">— xSOL</b></div><div><span>Entry price</span><b>—</b></div><div><span>Liquidation price</span><b>—</b></div><div><span>Trading fee</span><b>—</b></div></div><button class="button mint full" disabled>No market selected</button><div class="order-note"><span>i</span><div>At 10×, a small adverse move can liquidate your margin. Profits are capped per market. These positions do not have perpetual funding payments.</div></div><button class="text-button" data-wallet style="font-size:11px">Connect wallet to view balances ↗</button></aside></section>
<div class="below-note"><span><i class="status-icon"></i>Pre-launch · deposits & execution not enabled</span><span>0 listed markets · Max 10× · xSOL pairs</span></div><div class="market-only"><div><strong>Approved pump.fun coins. Isolated exposure.</strong><p>Origin verification is the first step. Each market also requires review, funded xSOL reserves and reliable oracle prices.</p></div><span class="tag">Built on Solana ↗</span></div><section class="feature-row"><div class="mini-card"><span class="card-icon">↗</span><div><b>Long or short, up to 10×</b><p>Isolated long or short exposure. Review the risk before signing.</p></div></div><div class="mini-card"><span class="card-icon">⊗</span><div><b>Reviewed market listings</b><p>Admission requires a permanent LeverMeme burn and SOL/token escrow. Trading capital is funded separately in xSOL.</p></div></div><div class="mini-card"><span class="card-icon">⇄</span><div><b>Published fee allocations</b><p>Fixed routes for treasury, user campaigns, market creators and buybacks.</p></div></div></section>${callout()}</div>`;

function launch() {
  const d = state.draft;
  return `<div class="page-width"><div class="page-head"><div><span class="label">MARKET LISTING / ADMISSION REVIEW</span><h1 class="title">List a pump.fun market.</h1><p>Request a long-and-short market with up to 10× isolated leverage. Admission requires approval, a permanent LeverMeme burn and SOL/token escrow. Separate xSOL capital is required before trading opens.</p></div><span class="tag green">XSOL PAIRED · MAX 10×</span></div><div class="launch-layout"><section class="form-panel"><div class="wizard-nav">${["Verify the token", "Set admission funding", "Review & burn"].map((text, i) => `<span class="${state.step === i + 1 ? "active" : ""}"><i>${i + 1}</i>${text}</span>`).join("")}</div><div class="wizard-body">
<div class="step-panel" ${state.step !== 1 ? "hidden" : ""}><h2>Verify the token’s pump.fun origin.</h2><p>We check the mint and its pump.fun bonding-curve account on Solana mainnet.</p><div class="form-field"><label for="mint">Token mint address</label><div class="input-row"><input class="input" id="mint" value="${esc(d.mint || "")}" placeholder="Paste the full Solana mint address" autocomplete="off" spellcheck="false"><button class="button mint" id="verify-mint">Verify ↗</button></div><p class="field-help">Use the contract address from the token's pump.fun page. A ticker or token name isn't enough.</p></div><div id="mint-result">${state.verified ? verifiedCard() : ""}</div><p class="form-message" id="verify-message" role="status"></p><div class="wizard-footer"><a href="/" class="text-button">← Back to markets</a><button class="button mint" data-next="2" ${!state.verified ? "disabled" : ""}>Liquidity <span>→</span></button></div></div>
<div class="step-panel" ${state.step !== 2 ? "hidden" : ""}><h2>Set your admission funding.</h2><p>Specify the SOL and verified meme tokens to place in listing escrow. These assets are separate from the xSOL capital that backs trading.</p><div class="two-fields"><div class="form-field"><label for="sol-liquidity">SOL admission escrow</label><div class="amount-wrap"><input id="sol-liquidity" value="${esc(d.sol || "")}" inputmode="decimal" placeholder="0.00"><span>SOL</span></div><p class="field-help">Keep additional SOL available for network fees.</p></div><div class="form-field"><label for="token-liquidity">Meme-token admission escrow</label><div class="amount-wrap"><input id="token-liquidity" value="${esc(d.tokens || "")}" inputmode="decimal" placeholder="0.00"><span>TOKENS</span></div><p class="field-help">Only the verified mint can fund this request.</p></div></div><div class="notice">There is no automatic SOL/token-to-xSOL conversion. A market needs additional xSOL reserves, approved price feeds and explicit activation before trading. Editing this form moves no assets.</div><p class="form-message" id="liquidity-message" role="status"></p><div class="wizard-footer"><button class="text-button" data-back="1">← Token</button><button class="button mint" id="review-listing">Review listing <span>→</span></button></div></div>
<div class="step-panel" ${state.step !== 3 ? "hidden" : ""}><h2>Review your listing request.</h2><p>Check the mint, escrow amounts and permanent burn before requesting operator review.</p><div class="review-list"><div class="review-item"><small>Quote asset</small><b>xSOL</b></div><div class="review-item"><small>Maximum leverage</small><b>10×</b></div><div class="review-item"><small>SOL supplied</small><b>${esc(d.sol || "—")} SOL</b></div><div class="review-item"><small>Meme tokens supplied</small><b>${esc(d.tokens || "—")}</b></div><div class="review-item"><small>LeverMeme burn</small><b>${state.runtime?.protocol ? formatUnits(state.runtime.protocol.policy.burnAmount,state.runtime.leverDecimals) : "Set at launch"}</b></div><div class="review-item"><small>Market status</small><b>Not listed</b></div></div><label class="check-label"><input type="checkbox" id="burn-ack">I understand that a token burn is permanent and providing market liquidity carries risk.</label><div class="notice">Listings are not open yet. The LeverMeme mint, xSOL mint, burn requirement and funded market program must be configured before a listing can execute.</div><p id="listing-gate" class="form-message" role="status"></p><div class="wizard-footer"><button class="text-button" data-back="2">← Liquidity</button><button class="button mint" id="save-listing">Save listing draft <span>↓</span></button></div>${state.runtime?.custodyEnabled ? `<button class="button mint full" style="margin-top:16px" id="execute-listing">Review burn & funding →</button>` : `<button class="button full" style="margin-top:16px" disabled>Burn & request review · opening soon</button>`}</div>
</div></section><aside class="launch-summary"><h3>Listing requirements</h3><div class="summary-row"><span>Eligibility</span><b>pump.fun coins only</b></div><div class="summary-row"><span>Pair</span><b>Meme / xSOL</b></div><div class="summary-row"><span>Trading</span><b>Long + short</b></div><div class="summary-row"><span>Leverage cap</span><b>10×</b></div><div class="summary-row"><span>Approval</span><b>Manual review required</b></div><div class="summary-row"><span>Burn</span><b>LeverMeme</b></div><div class="summary-row"><span>Admission escrow</span><b>SOL + meme tokens</b></div><p class="policy-note">Verifying a token does not list it. A request atomically burns LeverMeme and escrows SOL + tokens. Manual approval is required. The burn is permanent; escrow can be reclaimed before trading activation.</p><a class="small-link" href="/ecosystem/">Explore the ecosystem <span>↗</span></a></aside></div><section class="rules"><h2>Before you list</h2><details><summary>Why burn LeverMeme?</summary><p>An admission request includes a permanent LeverMeme burn. The configured amount is shown before signing; a burn does not by itself approve or activate a market.</p></details><details><summary>Why supply SOL and meme tokens?</summary><p>SOL and meme-token escrow secure the admission request. Trading requires separate xSOL capital. Escrow is not automatically converted, invested or used to back positions.</p></details><details><summary>Can any coin be listed?</summary><p>Only mints with an on-chain pump.fun bonding-curve account qualify for this verification flow. A qualifying mint still needs minimum funding, manual approval and market-specific risk limits before it can become tradeable.</p></details><details><summary>Is 10× available on every listing?</summary><p>10× is the platform cap. Each market must have sufficient liquidity and tested liquidation settings. Listing a token does not automatically enable 10× exposure.</p></details></section></div>`;
}
function verifiedCard() {
  return `<div class="mint-info"><b>✓ pump.fun origin verified</b><small>${esc(state.verified.mint)}</small><small>${state.verified.decimals} decimals · ${state.verified.graduated ? "Graduated to PumpSwap" : "On the bonding curve"} · finalized slot ${state.verified.slot}</small></div>`;
}

const ecosystem = () => renderEcosystem(callout(),state.runtime);
const account = () =>
  `<div class="page-width"><div class="page-head"><div><span class="label">WALLET / COLLATERAL / ACTIVITY</span><h1 class="title">Your trading account.</h1><p>Wallet balance, trading collateral, rewards and withdrawals. Everything in one place.</p></div><button class="button" data-wallet>${state.address ? short(state.address) : "Connect wallet"} ↗</button></div><section class="account-grid"><div class="balance-card"><span class="label">AVAILABLE TRADING COLLATERAL</span><strong>— <small>xSOL</small></strong><p>No collateral account has been opened.</p><div class="balance-actions"><button class="button mint" data-action="deposit">Deposit <span>↓</span></button><button class="button" data-action="withdraw">Withdraw <span>↑</span></button></div><div class="balance-secondary"><span>Wallet SOL · mainnet</span><b id="wallet-sol">${state.address ? (state.balance ?? "Loading…") : "Connect wallet"}</b></div></div><div class="balance-card"><span class="label">USER REWARDS</span><strong>0 <small>xSOL</small></strong><p>Rewards begin after markets open and the fee allocation is activated.</p><button class="button" disabled>No rewards to claim</button><div class="balance-secondary"><span>Rewards program</span><span>Not active</span></div></div></section><section class="portfolio-table"><h2>Positions & activity</h2><div class="table-head"><span>MARKET</span><span>SIDE</span><span>SIZE</span><span>ENTRY</span><span>PNL</span><span>STATUS</span></div><div class="portfolio-empty"><b>No trading activity.</b>No markets are listed, so there are no positions or transactions to show.<br><a class="small-link" style="margin-top:18px" href="/">Back to markets ↗</a></div></section>${callout()}</div>`;

function render() {
  document.title = `${{ trade: "Pump.fun leverage on Solana", launch: "List a pump.fun market", ecosystem: "Protocol economics", account: "Portfolio",admin:"Launch console",lending:"SOL lending · Design preview" }[state.view]} — LeverMeme`;
  const liveTrade=state.view==='trade'&&state.runtime?.configured&&state.runtime.markets?.length?renderLiveTrade(state.runtime,state):null;
  $("#main").innerHTML = state.view==='admin'?renderAdmin(state.runtime,state):state.view==='lending'?renderLending(state):liveTrade??(state.view==='account'&&state.runtime?.protocol?renderLivePortfolio(state.runtime,state):{ trade, launch, ecosystem, account }[state.view]());
  nav();
  bindView();
  syncWalletButtons();
  updateOrder();
  protocolController?.bind();
}
function go(path) {
  history.pushState({}, "", path);
  state.view = routeFor(path);
  render();
  window.scrollTo({ top: 0, behavior: "instant" });
  $(".header").classList.remove("menu-open");
  $(".menu-toggle").setAttribute("aria-expanded", "false");
}
document.addEventListener("click", (event) => {
  const link = event.target.closest("a[href]");
  if (
    link &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey &&
    event.button === 0 &&
    link.getAttribute("href").startsWith("/") &&
    !link.target
  ) {
    event.preventDefault();
    go(link.getAttribute("href"));
  }
  const walletButton = event.target.closest("[data-wallet]");
  if (walletButton) openWallet();
  const actionButton = event.target.closest("[data-action]");
  if (actionButton) openAction(actionButton.dataset.action);
});
window.addEventListener("popstate", () => {
  state.view = routeFor(location.pathname);
  render();
});
$(".menu-toggle").addEventListener("click", () => {
  const open = $(".header").classList.toggle("menu-open");
  $(".menu-toggle").setAttribute("aria-expanded", String(open));
});
$$("[data-close]").forEach((button) =>
  button.addEventListener("click", () => button.closest("dialog").close()),
);
$$("dialog").forEach((dialog) =>
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      )
        dialog.close();
    }
  }),
);

function updateOrder() {
  const size = positionSize(state.margin, state.leverage);
  if ($("#position-size"))
    $("#position-size").textContent = size ? `${size} xSOL` : "— xSOL";
}
function bindView() {
  bindLending(state);
  $$("[data-side]").forEach((button) =>
    button.addEventListener("click", () => {
      state.side = button.dataset.side;
      $$("[data-side]").forEach((x) => {
        const active = x.dataset.side === state.side;
        x.classList.toggle("active", active);
        x.setAttribute("aria-pressed", String(active));
      });
    }),
  );
  $("#leverage")?.addEventListener("input", (e) => {
    state.leverage = Number(e.target.value);
    $("#leverage-value").textContent = state.leverage + "×";
    updateOrder();
  });
  $("#margin")?.addEventListener("input", (e) => {
    state.margin = e.target.value;
    updateOrder();
  });
  $$("[data-filter]").forEach((button) =>
    button.addEventListener("click", () => {
      $$("[data-filter]").forEach((x) => {
        const active = x === button;
        x.classList.toggle("active", active);
        x.setAttribute("aria-pressed", String(active));
      });
      $("#search-message").textContent = "No markets listed yet.";
    }),
  );
  $("#market-search")?.addEventListener("input", (e) => {
    $("#search-message").textContent = e.target.value
      ? "No markets match your search."
      : "No markets listed yet.";
  });
  $$("[data-position-tab]").forEach((button) =>
    button.addEventListener("click", () => {
      $$("[data-position-tab]").forEach((x) => {
        x.classList.toggle("active", x === button);
        x.setAttribute("aria-pressed", String(x === button));
      });
      $("#position-empty-text").textContent = {
        positions: "No open positions.",
        orders: "No open orders.",
        history: "No trades yet.",
      }[button.dataset.positionTab];
    }),
  );
  $("#mint")?.addEventListener("input", (e) => {
    state.draft.mint = e.target.value.trim();
    state.verified = null;
    $("#mint-result").innerHTML = "";
    $('[data-next="2"]').disabled = true;
  });
  $("#verify-mint")?.addEventListener("click", verifyMint);
  $$("[data-next],[data-back]").forEach((button) =>
    button.addEventListener("click", () => {
      state.step = Number(button.dataset.next || button.dataset.back);
      render();
    }),
  );
  $("#sol-liquidity")?.addEventListener("input", (e) => {
    state.draft.sol = e.target.value;
  });
  $("#token-liquidity")?.addEventListener("input", (e) => {
    state.draft.tokens = e.target.value;
  });
  $("#review-listing")?.addEventListener("click", () => {
    if (
      !positiveDecimal(state.draft.sol || "") ||
      !positiveDecimal(state.draft.tokens || "", state.verified?.decimals ?? 9)
    ) {
      const msg = $("#liquidity-message");
      msg.textContent =
        "Enter positive SOL and token amounts within the token decimal limit.";
      msg.classList.add("error");
      return;
    }
    state.step = 3;
    render();
  });
  $("#save-listing")?.addEventListener("click", saveDraft);
}
async function verifyMint() {
  const button = $("#verify-mint"),
    message = $("#verify-message");
  if (state.loading) return;
  const requestedMint = state.draft.mint || "";
  state.loading = true;
  button.disabled = true;
  button.textContent = "Checking…";
  message.textContent = "Reading Solana mainnet…";
  message.classList.remove("error");
  try {
    const response = await fetch(
      "/api/coin?mint=" + encodeURIComponent(requestedMint),
      { signal: AbortSignal.timeout(20000) },
    );
    const body = await response.json();
    if (!response.ok)
      throw new Error(body.error || "Token verification unavailable.");
    if (state.draft.mint !== requestedMint) return;
    state.verified = body;
    if (state.view === "launch" && state.step === 1) {
      $("#mint-result").innerHTML = verifiedCard();
      message.textContent = "Pump.fun origin confirmed. Review liquidity next.";
      $('[data-next="2"]').disabled = false;
    }
  } catch (error) {
    state.verified = null;
    if (state.view === "launch" && state.step === 1) {
      message.textContent =
        error.name === "TimeoutError"
          ? "The mainnet read timed out. Please retry."
          : error.message;
      message.classList.add("error");
    }
  } finally {
    state.loading = false;
    if (button.isConnected) {
      button.disabled = false;
      button.textContent = "Verify ↗";
    }
  }
}

function syncWalletButtons() {
  $$("[data-wallet]").forEach((button) => {
    button.textContent = state.address
      ? short(state.address) + " ↗"
      : "Connect wallet ↗";
  });
}
function paintWallets() {
  const current = walletClient.wallet.getState();
  const list = $("#wallet-list");
  list.replaceChildren();
  if (current.connected) {
    const address = document.createElement("p");
    address.className = "wallet-address";
    address.textContent = current.connected.account.address;
    list.append(address);
    const disconnect = document.createElement("button");
    disconnect.className = "button full";
    disconnect.textContent = "Disconnect wallet";
    disconnect.addEventListener("click", async () => {
      try {
        await walletClient.wallet.disconnect();
        walletDialog.close();
        toast("Wallet disconnected.");
      } catch {
        $("#wallet-message").textContent =
          "Could not disconnect. Please retry.";
      }
    });
    list.append(disconnect);
    return;
  }
  if (!current.wallets.length) {
    const empty = document.createElement("div");
    empty.className = "wallet-empty";
    empty.textContent =
      "No compatible wallet detected. Open this site in your Solana wallet browser, or install a Wallet Standard wallet such as Phantom, Solflare or Backpack.";
    list.append(empty);
    return;
  }
  current.wallets.forEach((wallet) => {
    const button = document.createElement("button");
    button.className = "wallet-option";
    button.disabled = current.status === "connecting";
    const label = document.createElement("span");
    label.textContent = wallet.name;
    const arrow = document.createElement("span");
    arrow.textContent = "↗";
    button.append(label, arrow);
    button.addEventListener("click", async () => {
      $("#wallet-message").textContent =
        "Approve the connection in your wallet.";
      try {
        await walletClient.wallet.connect(wallet);
        walletDialog.close();
        toast("Wallet connected to LeverMeme.");
      } catch (error) {
        if (error.name !== "AbortError")
          $("#wallet-message").textContent =
            "Connection declined or unavailable. You can try again.";
      }
    });
    list.append(button);
  });
}
function openWallet() {
  paintWallets();
  $("#wallet-message").textContent = "";
  walletDialog.showModal();
}
async function refreshBalance(address) {
  const id = ++balanceRequest;
  state.balance = null;
  try {
    const r = await fetch(
      "/api/wallet?address=" + encodeURIComponent(address),
      { signal: AbortSignal.timeout(18000) },
    );
    const b = await r.json();
    if (!r.ok) throw new Error();
    if (id !== balanceRequest || state.address !== address) return;
    const raw = BigInt(b.lamports);
    state.balance = `${raw / 1000000000n}.${(raw % 1000000000n).toString().padStart(9, "0").slice(0, 4)} SOL`;
  } catch {
    if (id !== balanceRequest) return;
    state.balance = "Read unavailable";
  }
  if ($("#wallet-sol")) $("#wallet-sol").textContent = state.balance;
}
walletClient.wallet.subscribe(() => {
  const connected = walletClient.wallet.getState().connected;
  const next = connected?.account.address || null;
  if (next !== state.address) {
    state.address = next;
    state.balance = null;
    balanceRequest++;
    if (next) refreshBalance(next);
    else if ($("#wallet-sol")) $("#wallet-sol").textContent = "Connect wallet";
    protocolController?.refresh();
  }
  syncWalletButtons();
  if (walletDialog.open) paintWallets();
});
function openAction(action) {
  if(state.runtime?.protocol){protocolController.action(action);return;}
  $("#action-title").textContent =
    action === "deposit" ? "Deposit to a market." : "Withdraw collateral.";
  $("#action-content").innerHTML =
    `<p class="muted">${action === "deposit" ? "Deposits open when a funded market and verified collateral vault are available." : "Withdrawals will return available collateral from a verified market vault to your connected wallet."}</p><div class="notice">No markets have been listed. ${action === "deposit" ? "Do not send tokens to an unverified deposit address." : "There is no trading collateral account to withdraw from."}</div><div class="summary-row"><span>Network</span><b>Solana mainnet</b></div><div class="summary-row"><span>Quote asset</span><b>xSOL · mint pending</b></div><div class="summary-row"><span>Market vault</span><b>Not activated</b></div><button class="button full" style="margin-top:24px" disabled>${action === "deposit" ? "Deposits" : "Withdrawals"} not open</button>`;
  actionDialog.showModal();
}
protocolController=createProtocolController({walletClient,state,render,openWallet,toast});
render();
protocolController.refresh();
setInterval(()=>protocolController.refresh(),12000);
