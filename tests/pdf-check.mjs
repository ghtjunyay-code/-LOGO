import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {PDFDocument} from 'pdf-lib';
import {createQuotePdf} from '../lib/pdf.ts';
import {newQuote,newProduct,newSize,uid} from '../lib/quote.ts';
const q=newQuote();q.customer={name:'検証用 担当者',company:'テスト株式会社',email:'test@example.com',phone:'000-0000-0000'};q.delivery='2028-03-05';q.products=[];q.checked=true;
for(let i=0;i<4;i++){const p=newProduct();Object.assign(p,{name:`テスト商品 ${i+1}`,sku:`TEST-${i}`,manageNo:`管理番号-${i}`,color:'ネイビー',material:'綿100%',sizes:[{...newSize(),size:'M',quantity:'3'},{...newSize(),size:'L',quantity:'2'}]});p.spots=Array.from({length:3},(_,j)=>({...structuredClone(p.spots[0]),id:uid(),notes:('細かな部分は仕上がりをご相談ください。').repeat(j===2?55:1)+` END-${i}-${j}`,width:'70',height:'35',asset:{id:'test',name:'テストロゴ.png',type:'image/png',width:2,height:1}}));q.products.push(p)}
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aXioAAAAASUVORK5CYII=','base64');
await fs.mkdir('work/pdf',{recursive:true});const bytes=await createQuotePdf(q,new Uint8Array(await fs.readFile('public/fonts/NotoSansJP-Regular.ttf')),async()=>new Uint8Array(png));await fs.writeFile('work/pdf/test-multipage.pdf',bytes);const pdf=await PDFDocument.load(bytes);assert.ok(pdf.getPageCount()>=5);console.log(`PDF created: ${pdf.getPageCount()} pages, ${bytes.length} bytes`);

