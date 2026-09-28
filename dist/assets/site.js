const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const modal = $('#walletModal');
const toast = $('#toast');
let toastTimer;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

$$('[data-wallet]').forEach(button => button.addEventListener('click', () => modal?.classList.add('show')));
$$('[data-close-modal]').forEach(button => button.addEventListener('click', () => modal?.classList.remove('show')));
modal?.addEventListener('click', event => { if (event.target === modal) modal.classList.remove('show'); });
$$('[data-wallet-option]').forEach(button => button.addEventListener('click', () => {
  modal?.classList.remove('show');
  showToast('Demo wallet connected — no transaction was made.');
  $$('[data-wallet]').forEach(item => item.textContent = '7Vt…PONS');
}));

$('#mobileMenu')?.addEventListener('click', () => showToast('Use the page links in the footer on mobile.'));

const tradeToggle = $('#tradeToggle');
tradeToggle?.addEventListener('click', () => $('#orderPane')?.classList.toggle('open'));

if ($('#tradeDesk')) {
  const markets = [
    ['P','PONS','Pons Protocol','$2.60M','+52.09%'],
    ['L','LEVP','Lev Pad','$721.5K','+14.82%'],
    ['V','VAULT','Pons Vault','$288.9K','+32.80%'],
    ['N','NOVA','Nova Signals','$8.42M','+7.18%'],
    ['S','SOL','Solana','$86.3B','+2.11%'],
    ['M','MESH','Mesh Markets','$1.17M','-4.32%'],
    ['R','RIFT','Rift Protocol','$5.85M','+18.40%'],
    ['O','ORBIT','Orbit Coin','$904.2K','-2.76%'],
    ['K','KITE','Kite AI','$12.9M','+9.05%'],
    ['P','PRISM','Prism Labs','$3.18M','+4.44%'],
    ['A','ARC','Arc Network','$69.5M','-4.09%'],
    ['F','FLUX','Flux Point','$6.70M','+5.84%']
  ];
  const list = $('#marketList');
  const renderMarkets = query => {
    const clean = query.toLowerCase();
    list.innerHTML = markets.filter(m => m.join(' ').toLowerCase().includes(clean)).map((m, i) => `
      <button class="market-row ${m[1] === 'PONS' ? 'active' : ''}" data-symbol="${m[1]}" data-name="${m[2]}">
        <span class="coin-dot">${m[0]}</span><span><strong>${m[1]}</strong><small>${m[2]}</small></span>
        <span class="market-num">${m[3]}<small class="${m[4][0] === '-' ? 'negative' : 'positive'}">${m[4]}</small></span>
      </button>`).join('');
    $$('.market-row', list).forEach(row => row.addEventListener('click', () => {
      $$('.market-row', list).forEach(x => x.classList.remove('active'));
      row.classList.add('active');
      $('#activeSymbol').textContent = row.dataset.symbol;
      $('#activeName').textContent = row.dataset.name;
      $('#activeCoin').textContent = row.dataset.symbol[0];
      showToast(`${row.dataset.symbol} market selected`);
    }));
  };
  renderMarkets('');
  $('#marketSearch').addEventListener('input', event => renderMarkets(event.target.value));

  const margin = $('#margin');
  let leverage = 5;
  let side = 'Long';
  const updateOrder = () => {
    const value = Math.max(0, Number(margin.value || 0));
    $('#positionSize').textContent = `${(value * leverage).toFixed(2)} SOL`;
    $('#maxLoss').textContent = `${value.toFixed(2)} SOL`;
    const mark = 0.000657;
    const liq = side === 'Long' ? mark * (1 - .88 / leverage) : mark * (1 + .88 / leverage);
    $('#liquidation').textContent = `${liq.toFixed(6)} SOL`;
    $('#riskBar').style.width = `${Math.min(100, 15 + leverage * 14)}%`;
  };
  $$('.lev-btn').forEach(button => button.addEventListener('click', () => {
    $$('.lev-btn').forEach(x => x.classList.remove('active'));
    button.classList.add('active'); leverage = Number(button.dataset.lev); updateOrder();
  }));
  $$('.order-switch button').forEach(button => button.addEventListener('click', () => {
    $$('.order-switch button').forEach(x => x.classList.remove('active'));
    button.classList.add('active'); side = button.textContent.trim(); updateOrder();
  }));
  margin.addEventListener('input', updateOrder);
  $('#previewOrder').addEventListener('click', () => {
    if (!Number(margin.value)) return showToast('Enter a margin amount to preview the position.');
    showToast(`${side} preview ready — demo only, nothing submitted.`);
  });
  updateOrder();
}

if ($('#listForm')) {
  const mint = $('#mint');
  const lookup = $('#lookup');
  const result = $('#lookupResult');
  const syncLookup = () => lookup.disabled = mint.value.trim().length < 8;
  mint.addEventListener('input', syncLookup);
  lookup.addEventListener('click', () => { result.classList.add('show'); showToast('PONS market found in demo registry.'); });
  $('#pool').addEventListener('input', event => $('#poolValue').textContent = `${Number(event.target.value || 0).toFixed(2)} SOL`);
  $('#launchDemo').addEventListener('click', () => showToast('Preview saved locally — connect a real backend before launch.'));
}

$$('[data-demo-action]').forEach(button => button.addEventListener('click', () => showToast('Demo interaction — no funds moved.')));
