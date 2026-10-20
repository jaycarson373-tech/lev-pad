import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import coin from '../api/coin.mjs';
import wallet from '../api/wallet.mjs';

const root=new URL('../dist/',import.meta.url);
const server=createServer(async(req,res)=>{
  const pathname=new URL(req.url,'http://localhost').pathname;
  if(pathname.startsWith('/api/')){
    res.status=code=>{res.statusCode=code;return res;};res.json=body=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(body));};
    return pathname==='/api/coin'?coin(req,res):wallet(req,res);
  }
  const path=pathname==='/'?'index.html':pathname.endsWith('/')?pathname.slice(1)+'index.html':pathname.slice(1);
  try{const content=await readFile(new URL(path,root));res.setHeader('content-type',path.endsWith('.js')?'text/javascript':path.endsWith('.css')?'text/css':path.endsWith('.svg')?'image/svg+xml':'text/html');res.end(content);}catch{res.statusCode=404;res.end('Not found');}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto(origin);await page.locator('.desk').waitFor();await page.evaluate(()=>document.fonts.ready);
 assert.match(await page.title(),/LeverMeme/);assert.equal(await page.locator('#leverage').getAttribute('max'),'10');
 await page.locator('#margin').fill('1.25');assert.equal(await page.locator('#position-size').textContent(),'12.5 xSOL');
 await page.getByRole('button',{name:'↘ Short',exact:true}).click();assert.equal(await page.getByRole('button',{name:'↘ Short',exact:true}).getAttribute('aria-pressed'),'true');
 await page.locator('#margin').fill('-1');assert.equal(await page.locator('#position-size').textContent(),'— xSOL');
 await page.locator('#margin').fill('');
 const output=new URL('../../outputs/',import.meta.url);await mkdir(output,{recursive:true});
 await page.screenshot({path:new URL('levermeme-desktop.png',output).pathname,fullPage:true});
 await page.getByRole('button',{name:'Connect wallet ↗',exact:true}).first().click();await page.locator('#wallet-dialog[open]').waitFor();assert.match(await page.locator('#wallet-list').textContent(),/No compatible wallet detected/);await page.locator('#wallet-dialog [data-close]').click();
 await page.getByRole('button',{name:'Deposit',exact:true}).click();await page.locator('#action-dialog[open]').waitFor();assert.match(await page.locator('#action-content').textContent(),/No markets have been listed/);await page.locator('#action-dialog [data-close]').click();
 await page.locator('nav a[data-nav="launch"]').click();await page.locator('#mint').fill('invalid');await page.locator('#verify-mint').click();await page.waitForFunction(()=>document.querySelector('#verify-message')?.classList.contains('error'));assert.equal(await page.locator('[data-next="2"]').isDisabled(),true);
 await page.screenshot({path:new URL('levermeme-listing.png',output).pathname,fullPage:true});
 await page.route('**/api/coin?*',route=>route.fulfill({json:{mint:'BM2k8mJUbMthHoioykyUm2NjMrXvLBYhoXruwYLpump',decimals:6,graduated:true,slot:123}}));
 await page.locator('#mint').fill('BM2k8mJUbMthHoioykyUm2NjMrXvLBYhoXruwYLpump');await page.locator('#verify-mint').click();await page.locator('[data-next="2"]:enabled').waitFor();await page.locator('[data-next="2"]').click();
 await page.locator('#sol-liquidity').fill('2');await page.locator('#token-liquidity').fill('10000');await page.locator('#review-listing').click();await page.locator('#save-listing').click();
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('levermeme:list-draft')).tokens),'10000');
 assert.equal(await page.getByRole('button',{name:'Burn & list · opening soon',exact:true}).isDisabled(),true);
 await page.locator('nav a[data-nav="ecosystem"]').click();assert.equal(await page.locator('.eco-card').count(),4);
 await page.screenshot({path:new URL('levermeme-ecosystem.png',output).pathname,fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.goto(origin);await page.locator('.desk').waitFor();
 for(const route of ['/','/list-token/','/portfolio/','/ecosystem/']){
   await page.goto(origin+route);await page.locator('#main>*').waitFor();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`horizontal overflow on ${route}`);
 }
 await page.goto(origin);await page.locator('.desk').waitFor();await page.screenshot({path:new URL('levermeme-mobile.png',output).pathname,fullPage:true});
 await page.locator('.menu-toggle').click();assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');await page.locator('nav a[data-nav="launch"]').click();assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
 assert.deepEqual(errors,[]);console.log('Browser checks passed: 10x sizing, direction switch, wallet empty state, deposit gate, invalid-mint rejection, four ecosystem funds, mobile routes, mobile navigation, no page errors.');
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
