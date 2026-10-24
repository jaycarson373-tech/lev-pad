import { icon,leverageArtwork } from './icons.js';
import { renderListing,verifiedCard as renderVerifiedCard } from './listing.js';
import { listingReadiness } from '../lib/listing-readiness.mjs';
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

const productIcon = (kind) => {
 const paths={search:'M15 15l6 6M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0',up:'M5 19 19 5M5 5h14v14',risk:'M12 3 3 20h18L12 3Zm0 6v5m0 3v1',listing:'M5 3h14v18H5zM8 8h8m-8 4h8m-8 4h5',flow:'M4 6h16M4 18h16M8 3 4 6l4 3m8 6 4 3-4 3'};
 return `<svg class="product-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[kind]||paths.flow}"/></svg>`;
};
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

  () => `<div class="page-width"><section class="intro"><div><div class="intro-top"><span class="label">MEME COIN LEVERAGE ON SOLANA</span><span class="tag green">pump.fun markets</span></div><h1>Leveraged trading.<br><span>For pump.fun coins.</span></h1><p>Go long or short with up to 10× isolated leverage. Trade approved pump.fun markets against xSOL, with fully reserved, capped profits.</p></div><div class="intro-badge custom-leverage">${leverageArtwork()}</div></section>
<section class="stats" aria-label="Market statistics"><div class="stat"><span>LISTED MEMES</span><strong>${state.runtime?.configured ? "0" : "—"}</strong></div><div class="stat"><span>OPEN INTEREST</span><strong>${state.runtime?.configured ? "0" : "—"}<small>xSOL</small></strong></div><div class="stat"><span>LIQUIDITY SUPPLIED</span><strong>${state.runtime?.configured ? "0" : "—"}<small>xSOL</small></strong></div><div class="stat"><span>LEVERMEME BURNED</span><strong>${state.runtime?.configured ? "0" : "—"}<small>LM</small></strong></div></section>
<section class="desk" aria-label="Trading terminal"><aside class="market-pane"><div class="pane-head">Markets <span class="count">0</span></div><div class="search-box"><span><svg class="ui-icon" data-icon="search" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg></span><input id="market-search" placeholder="Search memes…" aria-label="Search memes" type="search"></div><div class="market-filter"><button class="filter active" data-filter="all" aria-pressed="true">All memes</button><button class="filter" data-filter="new" aria-pressed="false">New</button></div><div class="market-empty"><strong id="search-message">No markets listed yet.</strong><p>Review the admission requirements to request a market.</p><a class="small-link" href="/list-token/">List a meme <span><svg class="ui-icon" data-icon="arrowUpRight" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 18 18 6M6 6h12v12"/></svg></span></a></div></aside>
<div class="chart-pane"><div class="chart-top"><span class="token-placeholder"><svg class="ui-icon" data-icon="coin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><path d="M9 7v10h7M9 12h5"/></svg></span><div><b>Select a market</b><small>PUMP.FUN / XSOL</small></div><span class="chart-availability">Select a verified market</span></div><div class="empty-chart"><div class="empty-center"><div class="capsule-icon" aria-hidden="true"><svg class="ui-icon" data-icon="arrowUpRight" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 18 18 6M6 6h12v12"/></svg></div><span class="label">MARKET AVAILABILITY</span><h2>No markets open yet.</h2><p>Trading opens after contracts, reserves<br>and independent price feeds are verified.</p><a class="button mint" href="/list-token/">Review listing requirements <span><svg class="ui-icon" data-icon="plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 5v14M5 12h14"/></svg></span></a></div><span class="chart-watermark">LeverMeme</span></div><div class="positions"><div class="position-tabs"><button class="active" data-position-tab="positions" aria-pressed="true">Positions <span class="muted">0</span></button><button data-position-tab="orders" aria-pressed="false">Open orders <span class="muted">0</span></button><button data-position-tab="history" aria-pressed="false">Trade history</button></div><div class="position-empty"><span id="position-empty-text">No open positions.</span><a href="/portfolio/" class="green">View portfolio <svg class="ui-icon" data-icon="arrowUpRight" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 18 18 6M6 6h12v12"/></svg></a></div></div><div class="account-strip"><span>Available <b>— xSOL</b></span><div><button data-action="deposit">Deposit</button><button data-action="withdraw">Withdraw</button></div></div></div>
<aside class="order-pane"><div class="order-heading"><span>Place a trade</span><span class="tag">ISOLATED</span></div><div class="side-switch" aria-label="Trade direction"><button data-side="Long" class="${state.side === "Long" ? "active" : ""}" aria-pressed="${state.side === "Long"}"><svg class="ui-icon" data-icon="arrowUpRight" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 18 18 6M6 6h12v12"/></svg> Long</button><button data-side="Short" class="short ${state.side === "Short" ? "active" : ""}" aria-pressed="${state.side === "Short"}"><svg class="ui-icon" data-icon="trendDown" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m3 7 6 6 4-4 8 10m-7 0h7v-7"/></svg> Short</button></div><div class="field-header"><label for="leverage">Leverage</label><strong id="leverage-value">${state.leverage}×</strong></div><input type="range" id="leverage" min="1" max="10" step="1" value="${state.leverage}"><div class="range-labels"><span>1×</span><span>5×</span><span>10×</span></div><div class="field-header"><label for="margin">Margin</label><span>Available: —</span></div><div class="amount-wrap"><input id="margin" inputmode="decimal" placeholder="0.00" value="${esc(state.margin)}" autocomplete="off"><span>xSOL</span></div><p class="amount-note">Quotes appear when a funded market is selected.</p><div class="order-lines"><div><span>Position size</span><b id="position-size">— xSOL</b></div><div><span>Entry price</span><b>—</b></div><div><span>Liquidation price</span><b>—</b></div><div><span>Trading fee</span><b>—</b></div></div><button class="button mint full" disabled>No market selected</button><div class="order-note"><svg class="ui-icon" data-icon="info" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.1"/></svg><div>At 10×, a small adverse move can liquidate your margin. Profits are capped per market. These positions do not have perpetual funding payments.</div></div><button class="text-button" data-wallet style="font-size:11px">Connect wallet to view balances <svg class="ui-icon" data-icon="arrowUpRight" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 18 18 6M6 6h12v12"/></svg></button></aside></section>
<div class="below-note"><span><i class="status-icon"></i>Pre-launch · deposits & execution not enabled</span><span>0 listed markets · Max 10× · xSOL pairs</span></div><div class="market-only"><div><strong>Approved pump.fun coins. Isolated exposure.</strong><p>Origin verification is the first step. Each market also requires review, funded xSOL reserves and reliable oracle prices.</p></div><span class="tag">Built on Solana <svg class="ui-icon" data-icon="arrowUpRight" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 18 18 6M6 6h12v12"/></svg></span></div><section class="feature-row"><div class="mini-card"><span class="card-icon"><svg class="ui-icon" data-icon="trendUp" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m3 17 6-6 4 4 8-10m-7 0h7v7"/></svg></span><div><b>Long or short, up to 10×</b><p>Isolated long or short exposure. Review the risk before signing.</p></div></div><div class="mini-card"><span class="card-icon"><svg class="ui-icon" data-icon="shield" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m12 3 8 3v6c0 4-5 7-8 9-3-2-8-5-8-9V6z"/><path d="m8 12 3 3 5-6"/></svg></span><div><b>Reviewed market listings</b><p>Admission requires a permanent LeverMeme burn and SOL/token escrow. Trading capital is funded separately in xSOL.</p></div></div><div class="mini-card"><span class="card-icon"><svg class="ui-icon" data-icon="split" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 12h7m-1 0 5-6h5m-10 6 5 6h5m-3-15 3 3-3 3m0 6 3 3-3 3"/></svg></span><div><b>Published fee allocations</b><p>Fixed routes for treasury, user campaigns, market creators and buybacks.</p></div></div></section>${callout()}</div>`;


function launch() { return renderListing(state); }
function verifiedCard() { return renderVerifiedCard(state.verified); }

const ecosystem = () => renderEcosystem(callout(),state.runtime);
const account = () =>
  `<div class="page-width"><div class="page-head"><div><span class="label">WALLET / COLLATERAL / ACTIVITY</span><h1 class="title">Your trading account.</h1><p>Wallet balance, trading collateral, rewards and withdrawals. Everything in one place.</p></div><button class="button" data-wallet>${state.address ? short(state.address) : "Connect wallet"} <svg class="ui-icon" data-icon="arrowUpRight" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 18 18 6M6 6h12v12"/></svg></button></div><section class="account-grid"><div class="balance-card"><span class="label">AVAILABLE TRADING COLLATERAL</span><strong>— <small>xSOL</small></strong><p>No collateral account has been opened.</p><div class="balance-actions"><button class="button mint" data-action="deposit">Deposit <span><svg class="ui-icon" data-icon="arrowDown" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 4v16m-6-6 6 6 6-6"/></svg></span></button><button class="button" data-action="withdraw">Withdraw <span><svg class="ui-icon" data-icon="arrowUp" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 20V4m-6 6 6-6 6 6"/></svg></span></button></div><div class="balance-secondary"><span>Wallet SOL · mainnet</span><b id="wallet-sol">${state.address ? (state.balance ?? "Loading…") : "Connect wallet"}</b></div></div><div class="balance-card"><span class="label">USER REWARDS</span><strong>0 <small>xSOL</small></strong><p>Rewards begin after markets open and the fee allocation is activated.</p><button class="button" disabled>No rewards to claim</button><div class="balance-secondary"><span>Rewards program</span><span>Not active</span></div></div></section><section class="portfolio-table"><h2>Positions & activity</h2><div class="table-head"><span>MARKET</span><span>SIDE</span><span>SIZE</span><span>ENTRY</span><span>PNL</span><span>STATUS</span></div><div class="portfolio-empty"><b>No trading activity.</b>No markets are listed, so there are no positions or transactions to show.<br><a class="small-link" style="margin-top:18px" href="/">Back to markets <svg class="ui-icon" data-icon="arrowUpRight" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 18 18 6M6 6h12v12"/></svg></a></div></section>${callout()}</div>`;

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
    state.burnAck = false;
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
    state.burnAck = false;
  });
  $("#token-liquidity")?.addEventListener("input", (e) => {
    state.draft.tokens = e.target.value;
    state.burnAck = false;
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
  $("#burn-ack")?.addEventListener("change",event=>{
    state.burnAck=event.target.checked;
    const button=$("#execute-listing");
    if(button)button.disabled=!state.burnAck||!listingReadiness({runtime:state.runtime,address:state.address,mint:state.draft.mint,verified:state.verified,sol:state.draft.sol,tokens:state.draft.tokens}).ready;
  });
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
      button.innerHTML = "Verify " + icon("arrowRight");
    }
  }
}

function syncWalletButtons() {
  $$("[data-wallet]").forEach((button) => {
    button.innerHTML = (state.address ? esc(short(state.address)) : "Connect wallet") + icon("wallet");
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
    arrow.innerHTML = icon("arrowUpRight");
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
