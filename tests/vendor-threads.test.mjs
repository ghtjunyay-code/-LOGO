import test from 'node:test';
import assert from 'node:assert/strict';
import {newQuote,vendorThreads,parseQuote} from '../lib/quote.ts';
test('old self-selected colors are removed from new requests without modifying the source history',()=>{const old=newQuote(),s=old.products[0].spots[0];s.threadMode='指定する';s.thread='白（糸番号 1198）';s.threadSelections=[{source:'#ffffff',number:'1198'}];s.width='30';s.notes='左胸に配置';const next=vendorThreads(old),n=next.products[0].spots[0];assert.equal(n.threadMode,'業者に相談');assert.equal(n.thread,'');assert.equal(n.threadSelections,undefined);assert.equal(n.width,'30');assert.equal(n.notes,'左胸に配置');assert.equal(s.thread,'白（糸番号 1198）');assert.deepEqual(parseQuote(next),next)});
