'use client';
import {useState} from 'react';
import {Dialog,DialogContent,DialogTitle,DialogDescription,DialogClose} from '@/components/ui/dialog';
import {RadioGroup,RadioGroupItem} from '@/components/ui/radio-group';
import {Field} from '@/components/quote-controls';
import type {Spot} from '@/lib/quote';
import {threadColors,manualThreadText,type ThreadSelection} from '@/lib/thread-colors';
export default function ThreadPicker({spot:s,update}:{spot:Spot;update:(fn:(s:Spot)=>void)=>void}){
 const [edit,setEdit]=useState<number|null>(null);const rows=s.threadSelections||[];
 function changeRows(fn:(a:ThreadSelection[])=>void){update(x=>{const a=structuredClone(x.threadSelections||[]);fn(a);x.threadSelections=a;x.thread=manualThreadText(a)})}
 return <section className="thread-section" id={`${s.id}-thread-mode`} tabIndex={-1}>
 <h4>糸色の選び方</h4><RadioGroup value={s.threadMode} onValueChange={v=>update(x=>{x.threadMode=String(v)})} aria-label="糸色の選び方" className="thread-modes">
 <label><RadioGroupItem value="業者に相談"/>① 刺繍屋さんに近い糸色を選択してもらう</label><label><RadioGroupItem value="指定する"/>② 自分で糸を選ぶ</label></RadioGroup>
 {s.threadMode!=='未選択'&&<><h4 id={`${s.id}-thread`} tabIndex={-1}>色名・指定番号</h4><p className="muted">ロゴに使われている色名を入力して、その色に使う糸を色見本から選んでください。例：赤・白・黄色・黒を1色ずつ追加。</p>
 {s.threadMode==='業者に相談'&&<p className="muted">指定せずに進む場合は、刺繍屋さんがロゴ原稿を確認して糸色を選びます。</p>}
 {rows.map((r,i)=>{const c=threadColors.find(c=>c.number===r.number);return <div className="compact-thread-row" key={i}>

 <div className="thread-color-line"><Field label="色名（自由入力）" id={`${s.id}-color-name-${i}`} required value={r.colorName||''} onChange={v=>changeRows(a=>{a[i].colorName=v})} placeholder="例：赤、白、黄色、黒"/>
 <button className="thread-choice" id={`${s.id}-color-number-${i}`} disabled={!r.colorName?.trim()} onClick={()=>setEdit(i)}><span className="swatch" style={{background:c?.hex||'#ffffff'}}/><span><b>{c?.name||'糸色を選択'}</b><small>{c?'糸番号 '+c.number:'色名を入力して、色見本から選んでください'}</small></span><span className="pick-link">色見本から選ぶ</span></button><button className="quiet thread-remove" onClick={()=>changeRows(a=>{a.splice(i,1)})} aria-label={`${r.colorName||"この色"}を削除`}>×</button></div></div>})}
 <button className="secondary" style={{marginTop:16}} disabled={rows.length>=24} onClick={()=>changeRows(a=>{a.push({source:'#ffffff',number:'',colorName:'',confirmed:false})})}>＋ 色を追加</button>
 
 <Dialog open={edit!==null} onOpenChange={open=>{if(!open)setEdit(null)}}><DialogContent className="thread-dialog" showCloseButton={false}>
 <DialogClose className="thread-close" aria-label="色見本を閉じる">×</DialogClose><DialogTitle className="thread-title">{edit!==null?`${rows[edit]?.colorName||''}に使う糸を選ぶ`:'希望糸色を選ぶ'}</DialogTitle><DialogDescription>色見本・色名・糸番号を確認して選択してください。</DialogDescription>
 <div className="thread-grid">{threadColors.map(c=><button className="thread-sample" key={c.number} aria-pressed={edit!==null&&rows[edit]?.number===c.number} onClick={()=>{if(edit===null)return;const index=edit;changeRows(a=>{a[index]={...a[index],source:c.hex,number:c.number,confirmed:true}});setEdit(null)}}><span className="swatch" style={{background:c.hex}}/><span><b>{c.name}</b><small>糸番号 {c.number}</small></span></button>)}</div>
 <p className="muted">画面の色と実際の糸色には違いがあります。</p></DialogContent></Dialog></>}
 </section>;
}
