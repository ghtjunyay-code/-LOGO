'use client';
import ThreadPicker from '@/components/thread-picker';
import {Upload} from 'lucide-react';
import {Field,Choice,Notes,LogoPreview} from '@/components/quote-controls';
import {bodyColor} from '@/lib/body-color';
import {threadInstruction,locations,newSpot,resizeSpot,type Product,type Spot} from '@/lib/quote';
export default function EmbroideryEditor({products,uploading,upload,updateProduct,updateSpot,confirm}:{products:Product[];uploading:string;upload:(pid:string,sid:string,file?:File)=>Promise<void>;updateProduct:(id:string,fn:(p:Product)=>void)=>void;updateSpot:(pid:string,sid:string,fn:(s:Spot)=>void)=>void;confirm:(message:string,run:()=>void)=>void}){
 return <>{products.map((p,i)=><section className="product-card" key={p.id} id={`${p.id}-spots`} tabIndex={-1}><h3>商品 {i+1}　{p.name||'商品未指定'}</h3>
 <Choice label="① 刺繍箇所数を選択" value={`${p.spots.length}箇所`} options={Array.from({length:20},(_,i)=>`${i+1}箇所`)} onChange={v=>{const n=parseInt(v);const run=()=>updateProduct(p.id,x=>{x.spots=x.spots.slice(0,n);while(x.spots.length<n)x.spots.push(newSpot())});if(n<p.spots.length)confirm(`${n+1}箇所目以降の刺繍情報を削除します。`,run);else run()}}/>
 {p.spots.map((s,j)=>{const update=(fn:(s:Spot)=>void)=>updateSpot(p.id,s.id,fn),axis=s.axis||'width',mm=Array.from({length:1000},(_,i)=>String(i+1));if(s[axis]&&!mm.includes(s[axis]))mm.push(s[axis]);return <article className="review-block" key={s.id}><h3 className="spot-heading">刺繍箇所 {j+1}</h3>
 <h4>② ロゴデータをアップロード</h4><div className="filebox"><Upload size={24}/><label htmlFor={`${s.id}-file`}><b>{s.asset?s.asset.name:'ロゴ原稿を選択'}</b><span className="muted" style={{display:'block'}}>PNG・JPEG・WebP／1ファイル10MBまで</span></label><input id={`${s.id}-file`} type="file" accept="image/png,image/jpeg,image/webp" disabled={!!uploading} onChange={e=>{const f=e.target.files?.[0];if(f)void upload(p.id,s.id,f)}}/><button className="quiet" disabled={!!uploading} onClick={()=>void upload(p.id,s.id)}>{uploading===s.id?'原稿を保存中…':'原稿の保存を再試行'}</button></div>
 <h4 className="spot-heading">③ 部位・お仕上がりサイズを指定</h4><Choice label="刺繍部位" value={s.location} options={locations.includes(s.location)?locations:[s.location,...locations]} onChange={v=>update(x=>{x.location=v})}/>{s.location==='その他'&&<Field label="刺繍部位（自由入力）" required id={`${s.id}-other`} value={s.other} onChange={v=>update(x=>{x.other=v})}/>}
 <div className="grid2"><Choice label="指定方向" value={axis==='width'?'横幅':'縦寸法'} options={['横幅','縦寸法']} onChange={v=>update(x=>{x.axis=v==='横幅'?'width':'height';x.lock=true;const size=x[x.axis];if(Number(size)>0)Object.assign(x,resizeSpot(x,x.axis,String(Math.round(Number(size)))))})}/><Choice label="指定寸法（mm・1mm単位）" id={`${s.id}-${axis}`} value={s[axis]} options={mm} onChange={v=>update(x=>{x.lock=true;Object.assign(x,resizeSpot(x,axis,v))})}/></div>
 <p className="muted">もう一方の寸法はロゴの縦横比から自動計算します。</p>
 <LogoPreview spot={s} background={bodyColor(p.color)}/>
 <ThreadPicker spot={s} update={update}/>
 <Choice label="刺繍型データ" value={s.pattern} options={['あり','なし','不明']} onChange={v=>update(x=>{x.pattern=v})}/>{s.pattern==='あり'&&<Field label="型データの参照番号・元の依頼" required id={`${s.id}-reference`} value={s.reference} onChange={v=>update(x=>{x.reference=v})}/>}<Notes label="位置・仕上がりの希望、補足事項" value={s.notes} onChange={v=>update(x=>{x.notes=v})}/></article>})}</section>)}<div className="callout">画面の色と実際の刺繍糸・ボディの色は異なります。寸法・加工可否は刺繍屋さんが確認します。</div></>;
}
