import test from 'node:test';
import assert from 'node:assert/strict';
import {allowedLetteringFonts,allLetteringFonts,characterKinds} from '../lib/lettering-fonts.ts';
import {newQuote,validate,parseQuote} from '../lib/quote.ts';
import {newLetteringItem} from '../lib/lettering.ts';
test('font rules match all five requested character categories',()=>{
 assert.deepEqual(allowedLetteringFonts('AbCd'),['活字体','ゴシック体','筆記体','楷書体','イタリック体']);
 assert.deepEqual(allowedLetteringFonts('山口建設'),['楷書体','行書体','ゴシック体']);
 for(const t of ['やまぐち','ヤマグチ','ﾔﾏｸﾞﾁ'])assert.deepEqual(allowedLetteringFonts(t),['楷書体','ゴシック体']);
 assert.deepEqual(allowedLetteringFonts('012３４５'),allLetteringFonts);
});
test('mixed names use the intersection; numbers and punctuation do not restrict',()=>{
 for(const t of ['山口けんせつ','山口ABC','山口カンパニー'])assert.deepEqual(new Set(allowedLetteringFonts(t)),new Set(['楷書体','ゴシック体']));
 assert.deepEqual(allowedLetteringFonts('山口 １２３・建設'),['楷書体','行書体','ゴシック体']);
 assert.deepEqual(allowedLetteringFonts('ＡＢＣ123'),allowedLetteringFonts('ABC'));
 assert.deepEqual(characterKinds('ワークマン'),['カタカナ']);
});
test('company and person keep independent valid fonts and server catches invalid mixtures',()=>{
 const q=newQuote();q.products[0].spots[0].lettering={enabled:true,pocketAngle:0,items:[{...newLetteringItem('会社名'),text:'山口建設',font:'行書体'},{...newLetteringItem('個人名'),text:'Taro',font:'筆記体'}]};
 assert.deepEqual(parseQuote(q),q);assert.ok(!validate(q).some(e=>e.message.includes('共通して')));
 q.products[0].spots[0].lettering.items[0].text='山口けんせつ';assert.ok(validate(q).some(e=>e.message.includes('共通して')));
});
