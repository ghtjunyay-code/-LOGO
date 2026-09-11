import test from 'node:test';
import assert from 'node:assert/strict';
import {isolateArtwork} from '../lib/logo-artwork.ts';
import {newQuote,parseQuote,resizeSpot,displayAsset} from '../lib/quote.ts';
function image(w,h,color){return new Uint8ClampedArray(Array.from({length:w*h},()=>color).flat())}
function fill(data,w,x,y,ww,hh,color){for(let j=y;j<y+hh;j++)for(let i=x;i<x+ww;i++)data.set(color,(j*w+i)*4)}
test('outer white background is removed and enclosed white lettering remains',()=>{const d=image(20,16,[255,255,255,255]);fill(d,20,4,3,12,8,[180,0,0,255]);fill(d,20,7,5,3,3,[255,255,255,255]);const a=isolateArtwork(d,20,16);assert.deepEqual([a.x,a.y,a.width,a.height],[4,3,12,8]);assert.equal(a.data[3],0);assert.equal(a.data[(5*20+7)*4+3],255);assert.equal(d[3],255)});
test('transparent padding is cropped while a white logo is preserved',()=>{const d=image(12,10,[255,255,255,0]);fill(d,12,3,2,6,4,[255,255,255,255]);const a=isolateArtwork(d,12,10);assert.deepEqual([a.x,a.y,a.width,a.height],[3,2,6,4]);assert.equal(a.data[(2*12+3)*4+3],255)});
test('nonuniform edge colors are not erased and an empty result is not produced',()=>{const d=image(10,10,[255,255,255,255]);fill(d,10,0,0,5,10,[30,40,50,255]);assert.deepEqual(isolateArtwork(d,10,10).data,d);const blank=image(10,10,[255,255,255,255]);assert.deepEqual(isolateArtwork(blank,10,10).data,blank)});
test('dimensions follow cropped artwork and original reference survives storage',()=>{const q=newQuote(),s=q.products[0].spots[0];s.asset={id:'original',name:'logo.jpg',type:'image/jpeg',width:400,height:400,preview:{id:'prepared',width:200,height:100}};const resized=resizeSpot(s,'width','10');assert.equal(resized.height,'5');assert.equal(displayAsset(s.asset).id,'prepared');assert.equal(displayAsset(s.asset).type,'image/png');assert.deepEqual(parseQuote(q),q);assert.equal(s.asset.id,'original')});
