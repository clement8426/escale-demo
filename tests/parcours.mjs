import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {serve} from '../scripts/serve.mjs';
const basePath=process.env.NEXT_PUBLIC_BASE_PATH||'';
const external=process.env.DEMO_URL;
const server=external?null:await serve({port:4216,basePath});
const base=(external||`http://127.0.0.1:4216${basePath}`).replace(/\/$/,'');
const browser=await chromium.launch();
const context=await browser.newContext({viewport:{width:1440,height:1000}});
const page=await context.newPage();const errors=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400 && r.url().startsWith(base)) errors.push(`${r.status()} ${r.url()}`);});
async function ready(){await page.waitForFunction(()=>document.querySelectorAll('.product-card').length===18);}
async function fill(postal){for(const [id,value] of Object.entries({name:'Camille Démo',email:'camille@example.test',address:'Rue Exemple 12',postal,city:'Neuchâtel',phone:'0790000000'})) await page.locator('#'+id).fill(value);}
try {
 await page.goto(base+'/?mode=apres&corrections=1,2,3,4,5,6,7,8,9');await ready();
 // Aucun paramètre ni ancien état ne doit réparer cette version.
 await page.evaluate(()=>{const old=JSON.parse(localStorage.getItem('escale-public-v1')||'{}');localStorage.setItem('escale-public-v1',JSON.stringify({...old,fixes:[1,2,3,4,5,6,7,8,9]}));});
 await page.reload();await ready();
 assert.deepEqual(await page.locator('.card-copy').evaluateAll(es=>es.slice(0,3).map(e=>getComputedStyle(e).padding)),['12px','24px','36px']);
 assert.equal(await page.locator('.trainer,.restore-panel,a[href*="guide"]').count(),0);
 const styles=[];
 styles.push(await page.locator('[data-role="ajout-panier"]').first().evaluate(e=>[getComputedStyle(e).borderRadius,getComputedStyle(e).padding,getComputedStyle(e).backgroundColor]));
 await page.locator('[data-role="ajout-panier"]').first().click();
 await page.getByRole('link',{name:/Panier, 1 articles/}).click();
 await page.waitForURL(/panier/);
 await page.locator('.recommend').waitFor();
 styles.push(await page.locator('[data-role="ajout-panier"]').evaluate(e=>[getComputedStyle(e).borderRadius,getComputedStyle(e).padding,getComputedStyle(e).backgroundColor]));
 await page.getByRole('link',{name:'Passer la commande'}).click();await fill('20');
 await page.getByRole('button',{name:/Confirmer la commande fictive/}).click();
 assert.equal(await page.locator('#name').inputValue(),'');assert.equal(await page.locator('#postal-error').count(),1);
 await fill('2000');await page.getByRole('button',{name:/Confirmer la commande fictive/}).click();await page.waitForURL(/confirmation/);
 await page.getByRole('button',{name:'Annuler cette commande'}).click();
 assert.match(await page.locator('#modal-title').innerText(),/ne pas vouloir/);
 assert.equal(await page.getByRole('button',{name:'Oui',exact:true}).getAttribute('tabindex'),'-1');
 await page.keyboard.press('Tab');assert.equal(await page.locator('.modal button:focus').count(),0);
 await page.keyboard.press('Escape');assert.equal(await page.locator('.modal').count(),1);
 await page.getByRole('button',{name:'Oui',exact:true}).click();
 await page.goto(base+'/produits/sac-weekend/');
 await page.waitForSelector('.waiting');assert.equal(await page.locator('.skeleton').count(),0);assert.equal(await page.locator('.detail-title').count(),0);
 await page.waitForSelector('.detail-title');
 styles.push(await page.locator('[data-role="ajout-panier"]').evaluate(e=>[getComputedStyle(e).borderRadius,getComputedStyle(e).padding,getComputedStyle(e).backgroundColor]));
 assert.equal(new Set(styles.map(s=>JSON.stringify(s))).size,3);
 await page.waitForFunction(()=>document.querySelector('[data-d="7"]')?.complete);
 const image=await page.evaluate(async()=>{const r=await fetch(document.querySelector('[data-d="7"]').src);return (await r.blob()).size;});assert.ok(image>10_000_000);
 const scan=await new AxeBuilder({page}).analyze();const rules=scan.violations.map(v=>v.id);assert.ok(rules.includes('button-name'));assert.ok(rules.includes('color-contrast'));
 await mkdir('.preuves',{recursive:true});await page.screenshot({path:'.preuves/produit.png',fullPage:true});
 await page.goto(base+'/compte/');await page.locator('#login-email').fill('Camille@example.test');await page.locator('#login-password').fill('Escale2026!');await page.getByRole('button',{name:/Se connecter/}).click();await page.waitForURL(/commande/);
 await page.waitForFunction(()=>document.querySelector('#name')?.value==='Camille');
 await page.setViewportSize({width:390,height:844});await page.goto(base+'/');await ready();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:'.preuves/mobile.png',fullPage:false});
 assert.deepEqual(errors,[]);console.log('OK : 9 défauts présents, aucun contrôle de correction, panier/commande/connexion/mobile fonctionnels.');
}finally{await browser.close();if(server) await new Promise(r=>server.close(r));}
