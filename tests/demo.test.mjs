import {test} from 'node:test';
import assert from 'node:assert/strict';
import {loadProduct} from '../lib/demo.mjs';
import {products} from '../lib/catalogue.mjs';
test('catalogue complet',()=>{
 assert.equal(products.length,18);
 assert.equal(new Set(products.map(p=>p.id)).size,18);
});
test('une navigation annule le chargement sans erreur tardive',async()=>{
 const controller=new AbortController();const pending=loadProduct('sac-weekend',controller.signal);controller.abort();
 await assert.rejects(pending,{name:'AbortError'});
});
