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
 <div className="grid2"><Choice label="書体" value={t.font} options={letteringFonts} onChange={a=>itemChange(t.role,x=>{x.font=a})}/><Choice label="文字サイズ（高さ）" value={`${t.size} mm`} options={Array.from({length:48},(_,i)=>`${i+3} mm`)} onChange={a=>itemChange(t.role,x=>{x.size=parseInt(a)})}/></div>
 <button className="thread-choice" onClick={()=>setPicker(t.role)} aria-label={`${t.role}の糸色を選ぶ`}><span className="swatch" style={{background:c.hex}}/><span><b>{c.name}</b><small>糸番号 {c.number}</small></span><span className="pick-link">色見本から選ぶ</span></button>
 <div className="grid2"><Choice label="ロゴに対する配置" value={t.position} options={letteringPositions} onChange={a=>itemChange(t.role,x=>{x.position=a})}/><Choice label="間隔" value={`${t.gap} mm`} options={Array.from({length:201},(_,i)=>`${i} mm`)} onChange={a=>itemChange(t.role,x=>{x.gap=parseInt(a)})}/><Choice label="ポケット基準線に対する角度" value={`${t.angle}°`} options={Array.from({length:361},(_,i)=>`${i-180}°`)} onChange={a=>itemChange(t.role,x=>{x.angle=parseInt(a)})}/></div>
 </div>})}
 <Choice label="ポケット基準線の角度（水平から）" value={`${v.pocketAngle}°`} options={Array.from({length:91},(_,i)=>`${i-45}°`)} onChange={a=>change(x=>{x.pocketAngle=parseInt(a)})}/>
 <p className="muted">文字の角度が0°ならポケット基準線と平行です。プラスは右下がり、マイナスは右上がり。同じ側に2つ配置した場合、2つ目の間隔は先の文字からの距離です。</p>
 <Dialog open={picker!==null} onOpenChange={b=>{if(!b)setPicker(null)}}><DialogContent className="thread-dialog" showCloseButton={false}><DialogClose className="thread-close" aria-label="色見本を閉じる">×</DialogClose><DialogTitle>{picker}の糸色</DialogTitle><DialogDescription>色見本から糸色・糸番号を選んでください。</DialogDescription><div className="thread-grid">{threadColors.map(c=><button key={c.number} className="thread-sample" aria-pressed={v.items.find(t=>t.role===picker)?.thread===c.number} onClick={()=>{if(picker)itemChange(picker,x=>{x.thread=c.number});setPicker(null)}}><span className="swatch" style={{background:c.hex}}/><span><b>{c.name}</b><small>糸番号 {c.number}</small></span></button>)}</div></DialogContent></Dialog>
 </>}
 </section>;
}
