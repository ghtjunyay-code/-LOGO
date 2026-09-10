import {test} from 'node:test';
import assert from 'node:assert/strict';
import {newQuote,newSize,uid} from '../lib/quote.ts';
const base='http://localhost:3000',who='integration-test-'+uid();
async function request(path,method='GET',data,identity=who,extra={}){return fetch(base+path,{method,headers:{'oai-authenticated-user-id':identity,...(method==='POST'?{'Origin':base,'Content-Type':'application/json'}:{}),...extra},body:data===undefined?undefined:JSON.stringify(data)})}
test('storage lifecycle, conflict, dispatcher header protection, immutable history and search',async()=>{const q=newQuote();q.customer.name='TEST storage';q.customer.company='テスト組織';q.customer.phone='000-0000-0000';const p=q.products[0];Object.assign(p,{name:'TEST garment',color:'紺',material:'不明',manageNo:'TEST-MANAGE'});p.sizes=[{...newSize(),size:'M',quantity:'4'}];const logo=new Uint8Array(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aXioAAAAASUVORK5CYII=','base64'));let r=await fetch(base+'/api/files',{method:'POST',headers:{'Origin':base,'oai-authenticated-user-id':who,'Content-Type':'image/png','x-file-name':'test.png'},body:logo});assert.equal(r.status,200,await r.clone().text());const asset=await r.json();Object.assign(p.spots[0],{width:'30',height:'30',asset:{...asset,width:1,height:1}});q.checked=true;
 r=await request('/api/quotes','POST',{data:q,status:'draft',revision:0});assert.equal(r.status,200,await r.clone().text());assert.equal((await r.json()).revision,1);
 q.step=3;r=await request('/api/quotes','POST',{data:q,status:'draft',revision:1});assert.equal(r.status,200);assert.equal((await r.json()).revision,2);
 r=await request('/api/quotes','POST',{data:q,status:'draft',revision:1});assert.equal(r.status,409);
 r=await request('/api/quotes?id='+q.id);const restored=await r.json();assert.equal(restored.data.step,3);assert.deepEqual(restored.data.products,q.products);
 r=await request('/api/quotes?id='+q.id,'GET',undefined,'other-test-owner');assert.equal(r.status,200);
 r=await request('/api/files?id='+asset.id,'GET',undefined,'other-test-owner');assert.equal(r.status,200);
 r=await request('/api/files?id='+asset.id);assert.deepEqual(new Uint8Array(await r.arrayBuffer()),logo);
 const snapshot={...q,id:uid()};r=await request('/api/quotes','POST',{data:snapshot,status:'saved',revision:0});assert.equal(r.status,200,await r.clone().text());
 r=await request('/api/quotes','POST',{data:snapshot,status:'draft',revision:1});assert.equal(r.status,409);
 r=await request('/api/quotes?status=saved&search=test-manage');assert.ok((await r.json()).some(row=>row.id===snapshot.id));
 r=await request('/api/quotes','POST',{data:q,status:'draft',revision:2},who,{Origin:'https://untrusted.example'});assert.equal(r.status,403);
 const invalid={...q,id:uid(),checked:false};r=await request('/api/quotes','POST',{data:invalid,status:'saved',revision:0});assert.equal(r.status,400);
});


