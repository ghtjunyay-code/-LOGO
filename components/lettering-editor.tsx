'use client';
import {useState} from 'react';
import {Check,Choice} from './quote-controls';
import {Dialog,DialogContent,DialogTitle,DialogDescription,DialogClose} from './ui/dialog';
import {letteringFonts,letteringPositions,newLetteringItem,type Lettering,type LetteringItem} from '@/lib/lettering';
import {threadColors} from '@/lib/thread-colors';
import type {Spot} from '@/lib/quote';
export default function LetteringEditor({spot:s,update}:{spot:Spot;update:(fn:(s:Spot)=>void)=>void}){
 const v=s.lettering||{enabled:false,pocketAngle:0,items:[]};const [picker,setPicker]=useState<string|null>(null);
 const change=(fn:(v:Lettering)=>void)=>update(x=>{x.lettering=structuredClone(x.lettering||v);fn(x.lettering)});
 const itemChange=(role:string,fn:(t:LetteringItem)=>void)=>change(x=>{const t=x.items.find(t=>t.role===role);if(t)fn(t)});
 return <section className="lettering-editor" id={`${s.id}-lettering`} tabIndex={-1}>
 <Check label="会社名・個人名を追加する（任意）" checked={v.enabled} onChange={b=>change(x=>{x.enabled=b;if(b&&!x.items.length)x.items=[newLetteringItem('会社名')]})}/>
 {v.enabled&&<><div className="toolbar">{(['会社名','個人名'] as const).map(role=><Check key={role} label={role} checked={v.items.some(t=>t.role===role)} onChange={b=>change(x=>{x.items=b?[...x.items,newLetteringItem(role)]:x.items.filter(t=>t.role!==role)})}/>)}</div>
 {v.items.map(t=>{const c=threadColors.find(c=>c.number===t.thread)!;return <div className="lettering-item" key={t.role}>
 <label className="field" htmlFor={`${s.id}-lettering-${t.role}`}>{t.role}の刺繍文字 <em>必須</em><input id={`${s.id}-lettering-${t.role}`} value={t.text} maxLength={80} aria-required="true" placeholder={t.role==='会社名'?'例：株式会社 山口建設':'例：山田 太郎'} onChange={e=>itemChange(t.role,x=>{x.text=e.target.value})}/></label>
 <div className="grid2"><Choice label="書体" value={t.font} options={letteringFonts} onChange={a=>itemChange(t.role,x=>{x.font=a})}/><Choice label="文字サイズ（高さ）" value={`${t.size} mm`} options={Array.from({length:40},(_,i)=>`${i+11} mm`)} onChange={a=>itemChange(t.role,x=>{x.size=parseInt(a)})}/></div>
 <p className="muted">文字の縦寸法は12mmが一般的です。11mm以上でお選びください。</p>
 <button className="thread-choice" onClick={()=>setPicker(t.role)} aria-label={`${t.role}の糸色を選ぶ`}><span className="swatch" style={{background:c.hex}}/><span><b>{c.name}</b><small>糸番号 {c.number}</small></span><span className="pick-link">色見本から選ぶ</span></button>
 <div className="grid2"><Choice label="ロゴに対する配置" value={t.position} options={letteringPositions} onChange={a=>itemChange(t.role,x=>{x.position=a})}/><Choice label="間隔" value={`${t.gap} mm`} options={Array.from({length:201},(_,i)=>`${i} mm`)} onChange={a=>itemChange(t.role,x=>{x.gap=parseInt(a)})}/></div>
 </div>})}
 <fieldset className="lettering-direction"><legend>文字の向き</legend><div className="grid2">{(['ポケット・縫い目の角度に合わせる','地面に水平'] as const).map(direction=><button type="button" key={direction} className="direction-option" aria-pressed={(v.direction||'地面に水平')===direction} onClick={()=>change(x=>{x.direction=direction})}><svg viewBox="0 0 180 80" aria-hidden="true"><path d="M20 50 L160 25" stroke="#8b9aaa" strokeWidth="2" fill="none" strokeDasharray="4 3"/><text x="90" y="30" textAnchor="middle" fontSize="18" fill="#192d42" transform={direction==='地面に水平'?undefined:'rotate(-10 90 30)'}>会社名・個人名</text></svg><span>{direction}</span></button>)}</div></fieldset>
 <p className="muted">斜めの表示はイメージです。実際の商品に合わせて仕上げます。同じ側に2つ配置した場合、2つ目の間隔は先の文字からの距離です。</p>
 <Dialog open={picker!==null} onOpenChange={b=>{if(!b)setPicker(null)}}><DialogContent className="thread-dialog" showCloseButton={false}><DialogClose className="thread-close" aria-label="色見本を閉じる">×</DialogClose><DialogTitle>{picker}の糸色</DialogTitle><DialogDescription>色見本から糸色・糸番号を選んでください。</DialogDescription><div className="thread-grid">{threadColors.map(c=><button key={c.number} className="thread-sample" aria-pressed={v.items.find(t=>t.role===picker)?.thread===c.number} onClick={()=>{if(picker)itemChange(picker,x=>{x.thread=c.number});setPicker(null)}}><span className="swatch" style={{background:c.hex}}/><span><b>{c.name}</b><small>糸番号 {c.number}</small></span></button>)}</div></DialogContent></Dialog>
 </>}
 </section>;
}
