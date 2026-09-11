'use client';
import {useEffect,useRef,useState} from 'react';
import {Dialog,DialogContent,DialogTitle,DialogDescription,DialogClose} from '@/components/ui/dialog';
import {RadioGroup,RadioGroupItem} from '@/components/ui/radio-group';
import {Field} from '@/components/quote-controls';
import {assetUrl} from '@/lib/client';
import {displayAsset,type Spot} from '@/lib/quote';
import {analyzeLogo,threadColors,threadText,sourceColorName,colorDistance,type ThreadSelection} from '@/lib/thread-colors';
export default function ThreadPicker({spot:s,update}:{spot:Spot;update:(fn:(s:Spot)=>void)=>void}){
 const [edit,setEdit]=useState<number|null>(null),[status,setStatus]=useState(''),[retry,setRetry]=useState(0);
 const latest=useRef(update);latest.current=update;
 const asset=s.asset,hasRows=s.threadSelections!==undefined;
 useEffect(()=>{if(s.threadMode!=='業者に相談'||!asset||hasRows)return;
 // Preserve colors already chosen in drafts created before palette suggestions.
 if(s.thread.trim()){latest.current(x=>{if(x.threadSelections===undefined)x.threadSelections=threadColors.filter(c=>x.thread===c.number||x.thread.includes(`糸番号 ${c.number}）`)).map(c=>({source:c.hex,number:c.number}))});return}
 let active=true;setStatus('ロゴの色を自動判別しています…');
 analyzeLogo(assetUrl(displayAsset(asset))).then(rows=>{if(!active)return;latest.current(x=>{if(x.asset?.id!==asset.id||x.threadMode!=='業者に相談'||x.threadSelections!==undefined)return;x.threadSelections=rows;if(rows.length)x.thread=threadText(rows)});setStatus(rows.length?'':'色を読み取れませんでした。色見本から選択してください。')}).catch(e=>{if(active)setStatus(e.message)});
 return()=>{active=false};
 },[asset?.id,s.threadMode,s.thread,hasRows,retry]);
 function rowsChange(fn:(rows:ThreadSelection[])=>void){update(x=>{const rows=structuredClone(x.threadSelections||[]);fn(rows);x.threadSelections=rows;x.thread=threadText(rows)})}
 const rows=s.threadSelections||[];
 return <section className="thread-section" id={`${s.id}-thread-mode`} tabIndex={-1}><h4>糸色の選び方</h4><RadioGroup value={s.threadMode} onValueChange={v=>{setStatus('');update(x=>{x.threadMode=String(v)})}} aria-label="糸色の選び方" className="thread-modes">
 <label><RadioGroupItem value="業者に相談"/>① 刺繍屋さんに近い糸色を選択してもらう</label><label><RadioGroupItem value="指定する"/>② 自分で糸を選ぶ</label></RadioGroup>
 {s.threadMode!=='未選択'&&<><div className="field" id={`${s.id}-thread`} tabIndex={-1}>色名・指定番号</div>{s.threadMode==='業者に相談'&&<p className="muted">ロゴから読み取った色ごとに、近い糸を候補として表示します。色見本から順番に確認・変更してください。最終的な色合わせは刺繍屋さんが確認します。</p>}
 {status&&<p className="muted" role="status">{status}</p>}
 {rows.length>0&&<p className="muted">色候補 {rows.length}色 ／ 選択中の糸 {new Set(rows.map(r=>r.number)).size}色</p>}
 {rows.length>0&&s.threadMode==='業者に相談'&&<button className="secondary" onClick={()=>setEdit(Math.max(0,rows.findIndex(r=>!r.confirmed)))}>色ごとに順番に糸を選ぶ</button>}{rows.map((r,i)=>{const c=threadColors.find(c=>c.number===r.number);return <div className="thread-row" key={i}><button className="thread-choice" onClick={()=>setEdit(i)}><span className="swatch" style={{background:c?.hex}}/><span><b>{i+1}. {s.threadMode==='業者に相談'?sourceColorName(r.source)+' → ':''}{c?.name}</b><small>糸番号 {r.number}</small><small>ロゴの色 <span className="source-dot" style={{background:r.source}}/>{colorDistance(r.source,c?.hex||r.source)>25?'　近い色が少ないため要確認':''}</small></span><span className="pick-link">{r.confirmed?'選択済み・変更':'色見本から選ぶ'}</span></button><button className="quiet" aria-label={`糸色候補${i+1}を削除`} onClick={()=>rowsChange(a=>{a.splice(i,1)})}>削除</button></div>})}
 <button className="thread-choice" disabled={rows.length>=24} onClick={()=>setEdit(rows.length)}><span className="swatch"/><span><b>{rows.length?'糸色を追加':'糸色を選択'}</b><small>色見本の一覧から選んでください</small></span><span className="pick-link">色見本から選ぶ</span></button>
 {asset&&s.threadMode==='業者に相談'&&<button className="quiet" onClick={()=>{update(x=>{delete x.threadSelections;x.thread=''});setRetry(n=>n+1)}}>ロゴから選び直す</button>}
 <p className="muted">自動判別は目安です（最大24候補）。背景色や細かな色も確認し、不要な色は削除してください。近い糸色を登録済みの{threadColors.length}色から選びます。</p>
 <p className="muted">選択した糸：{s.thread||'未選択'}</p>
 <Dialog open={edit!==null} onOpenChange={open=>{if(!open)setEdit(null)}}><DialogContent className="thread-dialog" showCloseButton={false}>
 <DialogClose className="thread-close" aria-label="色見本を閉じる">×</DialogClose><DialogTitle className="thread-title">{edit!==null&&rows[edit]?`${edit+1}色目：${sourceColorName(rows[edit].source)}の糸を選ぶ`:'希望糸色を選ぶ'}</DialogTitle><DialogDescription>色見本・色名・糸番号を確認して選択してください。</DialogDescription>
 <div className="thread-grid">{threadColors.map(c=><button className="thread-sample" key={c.number} aria-pressed={edit!==null&&rows[edit]?.number===c.number} onClick={()=>{const index=edit;if(index===null)return;rowsChange(a=>{a[index]={source:a[index]?.source||c.hex,number:c.number,confirmed:true}});const next=rows.findIndex((r,i)=>i>index&&!r.confirmed);setEdit(s.threadMode==='業者に相談'&&next>=0?next:null)}}><span className="swatch" style={{background:c.hex}}/><span><b>{c.name}</b><small>糸番号 {c.number}</small></span></button>)}</div>
 <p className="muted">色は画面上の目安です。実際の糸色は刺繍屋さんにご確認ください。</p></DialogContent></Dialog></>}
 </section>;
}
