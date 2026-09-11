'use client';
import {Check,Choice,Field} from './quote-controls';
import {locations} from '@/lib/quote';
import {nameRow,previewName,rowName,type PersonalNames} from '@/lib/personal-names';
export default function PersonalNamesEditor({value:p,change,hasCompany}:{value:PersonalNames;change:(fn:(p:PersonalNames)=>void)=>void;hasCompany:boolean}){
 const options=(label:string,values:string[],selected:string,set:(v:string)=>void)=><fieldset className="personal-options"><legend>{label}</legend><div className="toolbar">{values.map(v=><button type="button" className="secondary" key={v} aria-pressed={v===selected} onClick={()=>set(v)}>{v}</button>)}</div></fieldset>;
 return <section className="personal-panel">
 {hasCompany&&options('個人名を入れる場所',['会社名と同じ場所','会社名と異なる場所'],'会社名と'+p.place,v=>change(x=>{x.place=v==='会社名と同じ場所'?'同じ場所':'異なる場所'}))}
 {hasCompany&&p.place==='同じ場所'?<>{options('会社名に対する個人名の位置',['上','下','左','右'],p.position,v=>change(x=>{x.position=v}))}{options('個人名の寄せ方',['左寄せ','中央寄せ','右寄せ'],p.align,v=>change(x=>{x.align=v}))}{p.align==='中央寄せ'&&['上','下'].includes(p.position)&&options('中央寄せの基準',['ロゴ＋会社名全体の中央','会社名の中央'],p.centerBasis||'会社名の中央',v=>change(x=>{x.centerBasis=v as PersonalNames['centerBasis']}))}</>:<><Choice label="個人名の刺繍位置" value={p.location} options={locations} onChange={v=>change(x=>{x.location=v})}/>{p.location==='その他'&&<Field label="個人名の刺繍位置（自由入力）" value={p.other} onChange={v=>change(x=>{x.other=v})}/>}</>}
 <div className="heading-row"><h4>個人名・商品の内訳</h4><button className="secondary" disabled={p.rows.length>=100} onClick={()=>change(x=>{x.rows.push(nameRow())})}>＋ 個人名を追加</button></div>
 <p className="muted">刺繍する文字のみを記入してください。苗字だけ、名前だけでも指定できます。</p>
 <div className="name-table-wrap"><table className="name-table"><thead><tr><th>サイズ</th><th>数量</th><th>苗字</th><th>名前</th><th>操作</th></tr></thead><tbody>{p.rows.map((r,i)=><tr key={r.id}><td><select aria-label={`${i+1}行目のサイズ`} value={r.size} onChange={e=>change(x=>{x.rows[i].size=e.target.value})}>{['SS','S','M','L','LL','3L','4L','5L','6L','フリー','未指定',...Array.from({length:61},(_,i)=>`ウエスト${i+60}cm`)].map(v=><option key={v}>{v}</option>)}</select></td><td><select aria-label={`${i+1}行目の数量`} value={r.quantity} onChange={e=>change(x=>{x.rows[i].quantity=Number(e.target.value)})}>{Array.from({length:50},(_,i)=><option key={i} value={i+1}>{i+1}着</option>)}</select></td><td><input aria-label={`${i+1}行目の苗字`} value={r.last} disabled={p.noName} maxLength={40} placeholder="山口" onChange={e=>change(x=>{x.rows[i].last=e.target.value})}/></td><td><input aria-label={`${i+1}行目の名前`} value={r.first} disabled={p.noName} maxLength={40} placeholder="太郎" onChange={e=>change(x=>{x.rows[i].first=e.target.value})}/></td><td><button className="quiet" disabled={p.rows.length===1} aria-label={`${i+1}行目を削除`} onClick={()=>change(x=>{x.rows.splice(i,1);if(!x.rows.some(r=>r.id===x.previewId))x.previewId=x.rows[0].id})}>削除</button></td></tr>)}</tbody></table></div>
 {hasCompany&&<Check label="この商品は個人名なし（会社名のみ刺繍）" checked={p.noName} onChange={v=>change(x=>{x.noName=v})}/>}
 <p>合計数量：<b>{p.rows.reduce((n,r)=>n+r.quantity,0)}着</b></p>
 {!p.noName&&<><label className="field">プレビューする個人名<select value={p.previewId} onChange={e=>change(x=>{x.previewId=e.target.value})}>{p.rows.map((r,i)=><option key={r.id} value={r.id}>{rowName(r)||`${i+1}行目（未入力）`}</option>)}</select></label><p className="muted">見本表示：{previewName(p)||'未入力'}。書体・文字サイズ・糸色は、この内訳の個人名すべてに共通です。</p></>}
 <p className="muted">同じサイズ・名前が複数ある場合は数量を増やしてください。数量は1〜50着、最大100行まで追加できます。</p>
 </section>;
}
