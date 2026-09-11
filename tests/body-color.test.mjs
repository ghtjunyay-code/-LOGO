import test from 'node:test';
import assert from 'node:assert/strict';
import {bodyColorOptions,bodyColor,productColorText} from '../lib/body-color.ts';
import {newQuote,parseQuote,copyProduct} from '../lib/quote.ts';
test('requested colors have reference background colors and free text is retained',()=>{assert.equal(bodyColorOptions.length,16);for(const name of bodyColorOptions)assert.match(bodyColor(name),/^#[0-9a-f]{6}$/);assert.notEqual(bodyColor('紺（ネイビー）'),'#ffffff');const q=newQuote(),p=q.products[0];p.color='紺（ネイビー）';p.colorNotes='メーカー色番号 123';assert.deepEqual(parseQuote(q),q);assert.equal(copyProduct(p,true).colorNotes,p.colorNotes);assert.equal(productColorText(p),'紺（ネイビー） ／ メーカー色番号 123');p.color='その他（自由入力）';assert.equal(productColorText(p),'メーカー色番号 123')});
