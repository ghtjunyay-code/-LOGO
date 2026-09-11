'use client';
import {Choice,Field} from './quote-controls';
const kinds=['半袖Tシャツ','ノースリーブ','半袖ポロシャツ','半袖シャツ','長袖Tシャツ','ラグラン','長袖ポロシャツ','パーカー','トレーナー','スウェット','ジャージ','エプロン','作業服（長袖ブルゾン）','作業服（半袖ブルゾン）','作業服（長袖シャツ）','作業服（半袖シャツ）','つなぎ服','ウィンドブレーカー（ヤッケ）','イベントブルゾン','イベントベスト','防寒着','パンツ'];
export default function ProductKind({id,value,onChange}:{id:string;value:string;onChange:(value:string)=>void}){
 const custom=value!==''&&value!=='未指定'&&!kinds.includes(value);
 return <div><Choice label="種類" id={`${id}-kind`} value={custom?'その他（自由入力）':value||'未指定'} options={['未指定',...kinds,'その他（自由入力）']} onChange={onChange}/>{custom&&<Field label="種類（自由入力）" id={`${id}-kind-custom`} value={value==='その他（自由入力）'||value==='その他'?'':value} onChange={v=>onChange(v||'その他（自由入力）')} placeholder="商品の種類を入力してください"/>}</div>;
}
