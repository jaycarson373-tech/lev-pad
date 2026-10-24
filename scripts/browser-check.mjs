import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import coin from '../api/coin.mjs';
import wallet from '../api/wallet.mjs';
import runtime from '../api/runtime.mjs';
import transaction from '../api/transaction.mjs';
import launch from '../api/launch.mjs';
import { key } from '../tests/helpers/protocol-fixture.mjs';

const root=new URL('../dist/',import.meta.url);
const server=createServer(async(req,res)=>{
  const pathname=new URL(req.url,'http://localhost').pathname;
  if(pathname.startsWith('/api/')){
    res.status=code=>{res.statusCode=code;return res;};res.json=body=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(body));};
    if(req.method==='POST'){let body='';for await(const chunk of req){body+=chunk;if(body.length>12000){res.statusCode=413;res.end();return;}}try{req.body=JSON.parse(body);}catch{res.statusCode=400;res.end();return;}}
    const handler={'/api/coin':coin,'/api/wallet':wallet,'/api/runtime':runtime,'/api/transaction':transaction,'/api/launch':launch}[pathname];
    if(!handler){res.statusCode=404;res.end();return;}return handler(req,res);
  }
  const path=pathname==='/'?'index.html':pathname.endsWith('/')?pathname.slice(1)+'index.html':pathname.slice(1);
  try{const content=await readFile(new URL(path,root));res.setHeader('content-type',path.endsWith('.js')?'text/javascript':path.endsWith('.css')?'text/css':path.endsWith('.svg')?'image/svg+xml':'text/html');res.end(content);}catch{res.statusCode=404;res.end('Not found');}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin=process.env.TEST_ORIGIN || `http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto(origin);await page.locator('.desk').waitFor();await page.evaluate(()=>document.fonts.ready);
 assert.match(await page.title(),/LeverMeme/);assert.equal(await page.locator('#leverage').getAttribute('max'),'10');
 await page.locator('#margin').fill('1.25');assert.equal(await page.locator('#position-size').textContent(),'12.5 xSOL');
 await page.getByRole('button',{name:'Short',exact:true}).click();assert.equal(await page.getByRole('button',{name:'Short',exact:true}).getAttribute('aria-pressed'),'true');
 await page.locator('#margin').fill('-1');assert.equal(await page.locator('#position-size').textContent(),'— xSOL');
 await page.locator('#margin').fill('');
 const output=new URL('../../outputs/',import.meta.url);await mkdir(output,{recursive:true});
 await page.screenshot({path:new URL('levermeme-desktop.png',output).pathname,fullPage:true});
 await page.getByRole('button',{name:'Connect wallet',exact:true}).first().click();await page.locator('#wallet-dialog[open]').waitFor();assert.match(await page.locator('#wallet-list').textContent(),/No compatible wallet detected/);await page.locator('#wallet-dialog [data-close]').click();
 await page.getByRole('button',{name:'Deposit',exact:true}).click();await page.locator('#action-dialog[open]').waitFor();assert.match(await page.locator('#action-content').textContent(),/No markets have been listed/);await page.locator('#action-dialog [data-close]').click();
 await page.locator('nav a[data-nav="launch"]').click();await page.locator('#mint').fill('invalid');await page.locator('#verify-mint').click();await page.waitForFunction(()=>document.querySelector('#verify-message')?.classList.contains('error'));assert.equal(await page.locator('[data-next="2"]').isDisabled(),true);
 await page.screenshot({path:new URL('levermeme-listing.png',output).pathname,fullPage:true});
 await page.route('**/api/coin?*',route=>route.fulfill({json:{mint:'BM2k8mJUbMthHoioykyUm2NjMrXvLBYhoXruwYLpump',decimals:6,graduated:true,slot:123}}));
 await page.locator('#mint').fill('BM2k8mJUbMthHoioykyUm2NjMrXvLBYhoXruwYLpump');await page.locator('#verify-mint').click();await page.locator('[data-next="2"]:enabled').waitFor();await page.locator('[data-next="2"]').click();
 await page.locator('#sol-liquidity').fill('2');await page.locator('#token-liquidity').fill('10000');await page.locator('#review-listing').click();await page.locator('#save-listing').click();
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('levermeme:list-draft')).tokens),'10000');
 assert.equal(await page.getByRole('button',{name:'Burn & request review · opening soon',exact:true}).isDisabled(),true);
 assert.match(await page.locator('.launch-summary').textContent(),/Manual review required/);
 await page.locator('nav a[data-nav="ecosystem"]').click();assert.equal(await page.locator('.eco-card').count(),4);
 assert.deepEqual(await page.locator('.eco-card .metric').allTextContents(),['75%','10%','5%','10%']);
 assert.match(await page.locator('.launch-callout').first().textContent(),/10% of supply/);
 await page.screenshot({path:new URL('levermeme-ecosystem.png',output).pathname,fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.goto(origin);await page.locator('.desk').waitFor();
 for(const route of ['/','/trade/','/list-token/','/portfolio/','/ecosystem/','/admin/','/lending/']){
   await page.goto(origin+route);await page.locator('#main>*').waitFor();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`horizontal overflow on ${route}`);
 }
 await page.goto(origin+'/admin/');await page.getByRole('heading',{name:'Launch with receipts.'}).waitFor();
 assert.match(await page.locator('#main').textContent(),/Never enter a private key/);
 const runtimeResponse=await page.request.get(origin+'/api/runtime');assert.equal(runtimeResponse.status(),200);assert.equal((await runtimeResponse.json()).configured,false);
 assert.equal((await page.request.get(origin+'/api/transaction')).status(),405);
 await page.getByRole('heading',{name:'Save now. Add your addresses last.'}).waitFor();
 await page.locator('[data-setup-form] input[name="admin"]').fill(key(4));
 await page.getByRole('button',{name:'Check public setup',exact:true}).click();await page.locator('.setup-checks').waitFor();
 assert.match(await page.locator('[data-setup-message]').textContent(),/final public addresses/);
 const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Download setup draft',exact:true}).click();const download=await downloadPromise;
 const exported=JSON.parse(await readFile(await download.path(),'utf8'));assert.equal(exported.admin,key(4));assert.equal(exported.leverMint,null);assert.equal(exported.custodyEnabled,false);assert.equal(exported.tradingEnabled,false);
 await page.locator('[data-setup-form] details').evaluate(element=>element.open=true);
 await page.locator('[data-artifact-file]').setInputFiles({name:'wallet.json',mimeType:'application/json',buffer:Buffer.from('{}')});assert.match(await page.locator('[data-setup-message]').textContent(),/never a wallet/);
 await page.screenshot({path:new URL('levermeme-setup.png',output).pathname,fullPage:true});
 await page.goto(origin);await page.locator('.desk').waitFor();await page.screenshot({path:new URL('levermeme-mobile.png',output).pathname,fullPage:true});
 await page.locator('.menu-toggle').click();assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');await page.locator('nav a[data-nav="launch"]').click();assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
 // Explicit UI fixture, not an assertion of a live mainnet market.
 const mockMarket={address:key(50),baseMint:key(12),listing:key(51),lister:key(1),enabled:true,approved:true,closed:false,priceFresh:true,price:'1000000000000',twap:'1000000000000',priceSlot:'100',liquidity:'5000000000',reservedProfit:'100000000',openInterest:'200000000',accruedFees:'3000',risk:{maxLeverage:10,maxProfitBps:30000,spreadBps:10,minOracles:3,emergencyDelaySeconds:'3600'}};
 const mockRuntime={configured:true,network:'solana:mainnet',programAddress:key(2),protocolAddress:key(3),admin:key(1),quoteMint:key(11),leverMint:key(10),quoteDecimals:6,leverDecimals:6,protocol:{paused:false,policy:{feeBps:30,burnAmount:'100'}},custodyEnabled:true,tradingEnabled:true,markets:[mockMarket],positions:[],listings:[],blockers:[]};
 await page.route('**/api/runtime*',route=>route.fulfill({json:mockRuntime}));
 await page.setViewportSize({width:1440,height:1000});await page.goto(origin);await page.getByRole('heading',{name:'Leveraged trading. For pump.fun coins.'}).waitFor();
 assert.match(await page.locator('.order-pane').textContent(),/Profit is capped/);
 await page.locator('#margin').fill('1.25');assert.equal(await page.locator('#position-size').textContent(),'12.5 xSOL');
 await page.getByRole('button',{name:'Review trade',exact:true}).click();await page.locator('#wallet-dialog[open]').waitFor();await page.locator('#wallet-dialog [data-close]').click();
 await page.screenshot({path:new URL('levermeme-live-fixture.png',output).pathname,fullPage:true});
 for(const route of ['/','/portfolio/','/ecosystem/','/admin/']){
  await page.setViewportSize({width:390,height:844});await page.goto(origin+route);await page.waitForFunction(()=>document.querySelector('#main')?.textContent.includes('verified')||document.querySelector('#main')?.textContent.includes('Leveraged trading.')||document.querySelector('#main')?.textContent.includes('configured'));
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`live fixture overflow on ${route}`);
 }
 await page.goto(origin+'/lending/');await page.getByRole('heading',{name:'Borrow SOL. Keep your token exposure.'}).waitFor();
 await page.locator('#collateral-value').fill('10');assert.equal(await page.locator('[data-loan-limit]').textContent(),'2.5 SOL');
 assert.equal(await page.getByRole('button',{name:'Borrowing not available',exact:true}).isDisabled(),true);assert.equal(await page.getByRole('button',{name:'Lending not available',exact:true}).isDisabled(),true);
 await page.locator('#collateral-value').fill('-1');assert.match(await page.locator('[data-loan-message]').textContent(),/positive SOL/);assert.equal(await page.locator('[data-loan-limit]').textContent(),'— SOL');
 await page.locator('#collateral-value').fill('10');
 await page.screenshot({path:new URL('levermeme-lending-mobile.png',output).pathname,fullPage:true});
 await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:new URL('levermeme-lending-desktop.png',output).pathname,fullPage:true});
 for(const width of [768,1024]){
  await page.setViewportSize({width,height:1000});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`lending overflow at ${width}px`);
 }
 await page.screenshot({path:new URL('levermeme-lending-tablet.png',output).pathname,fullPage:true});
 // Explicit public-address-only wallet fixture. It cannot sign or broadcast.
 // Proves the listing UX requires an unused wallet/mint permit AND burn acknowledgement.
 await page.addInitScript(({address})=>{
  const account={address,publicKey:new Uint8Array(32).fill(1),chains:['solana:mainnet'],features:['solana:signTransaction']};
  const wallet={version:'1.0.0',name:'Listing test wallet',icon:'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"/%3E',chains:['solana:mainnet'],accounts:[],features:{
   'standard:connect':{version:'1.0.0',connect:async()=>{wallet.accounts=[account];return {accounts:[account]};}},
   'standard:disconnect':{version:'1.0.0',disconnect:async()=>{wallet.accounts=[];}},
   'standard:events':{version:'1.0.0',on:()=>()=>{}},
   'solana:signTransaction':{version:'1.0.0',supportedTransactionVersions:[0],signTransaction:async()=>{window.fixtureSigningAttempts=(window.fixtureSigningAttempts||0)+1;throw new Error('Fixture signing is disabled');}}
  }};
  const register=api=>api.register(wallet);window.addEventListener('wallet-standard:app-ready',event=>register(event.detail));window.dispatchEvent(new CustomEvent('wallet-standard:register-wallet',{detail:register}));
 },{address:key(1)});
 const listingMint='BM2k8mJUbMthHoioykyUm2NjMrXvLBYhoXruwYLpump';
 const listingRuntime={...mockRuntime,protocol:{paused:false,policy:{feeBps:30,burnAmount:'1000000',minSolLamports:'1000000'}},permits:[{protocol:key(3),lister:key(1),baseMint:listingMint,consumed:false,expiresAt:String(Math.floor(Date.now()/1000)+3600)}]};
 await page.route('**/api/runtime*',route=>route.fulfill({json:listingRuntime}));
 await page.route('**/api/wallet*',route=>route.fulfill({json:{lamports:'100000000'}}));
 await page.route('**/api/transaction*',route=>route.fulfill({status:503,json:{error:'Controlled test: signer is not requested.'}}));
 await page.setViewportSize({width:1440,height:1000});await page.goto(origin+'/list-token/');
 await page.getByRole('button',{name:'Connect wallet',exact:true}).first().click();await page.getByRole('button',{name:'Listing test wallet',exact:true}).click();await page.locator('#wallet-dialog').waitFor({state:'hidden'});
 await page.locator('#mint').fill(listingMint);await page.locator('#verify-mint').click();await page.locator('[data-next="2"]:enabled').waitFor();await page.locator('[data-next="2"]').click();
 await page.locator('#sol-liquidity').fill('0.001');await page.locator('#token-liquidity').fill('1');await page.locator('#review-listing').click();
 await page.waitForFunction(()=>document.querySelectorAll('.admission-checks .passed').length===6);
 assert.equal(await page.locator('#execute-listing').isDisabled(),true);await page.locator('#burn-ack').check();assert.equal(await page.locator('#execute-listing').isEnabled(),true);
 await page.locator('#toast.show').waitFor({state:'hidden'});
 await page.screenshot({path:new URL('levermeme-listing-review-fixture-desktop.png',output).pathname,fullPage:true});
 await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await page.screenshot({path:new URL('levermeme-listing-review-fixture-mobile.png',output).pathname,fullPage:true});
 await page.locator('#execute-listing').click();await page.getByText('Controlled test: signer is not requested.',{exact:true}).waitFor();assert.equal(await page.evaluate(()=>window.fixtureSigningAttempts||0),0);
 assert.deepEqual(errors,[]);console.log('Browser checks passed: 7 responsive routes, professional copy, inactive lending illustration, prelaunch gates, listing drafts, ecosystem, admin console, explicitly mocked active-market rendering, trade wallet gate, no page errors.');
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
