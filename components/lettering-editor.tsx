'use client';
import PersonalNamesEditor from './personal-names-editor';
import {newPersonalNames,personalText,previewName} from '@/lib/personal-names';
import GuideEditor from './guide-editor';
import {defaultGuide} from '@/lib/embroidery-guide';
import {allowedLetteringFonts,canonicalFont,characterKinds} from '@/lib/lettering-fonts';
import {useState} from 'react';
import {Check,Choice} from './quote-controls';
import {Dialog,DialogContent,DialogTitle,DialogDescription,DialogClose} from './ui/dialog';
import {hasLetteringGap,letteringFonts,letteringPositions,newLetteringItem,type Lettering,type LetteringItem} from '@/lib/lettering';
import {threadColors} from '@/lib/thread-colors';
import type {Spot} from '@/lib/quote';
export default function LetteringEditor({spot:s,update,background='#ffffff'}:{background?:string;spot:Spot;update:(fn:(s:Spot)=>void)=>void}){
 const v=s.lettering||{enabled:false,pocketAngle:0,guide:{...defaultGuide},items:[]};const [picker,setPicker]=useState<string|null>(null);
 const change=(fn:(v:Lettering)=>void)=>update(x=>{x.lettering=structuredClone(x.lettering||v);fn(x.lettering)});
 const itemChange=(role:string,fn:(t:LetteringItem)=>void)=>change(x=>{const t=x.items.find(t=>t.role===role);if(t)fn(t)});
 return <section className="lettering-editor" id={`${s.id}-lettering`} tabIndex={-1}>
 <Check label="会社名・個人名を追加する（任意）" checked={v.enabled} onChange={b=>change(x=>{x.enabled=b;if(b&&!x.items.length)x.items=[newLetteringItem('会社名')]})}/>
 {v.enabled&&<><div className="toolbar">{(['会社名','個人名'] as const).map(role=><Check key={role} label={role} checked={v.items.some(t=>t.role===role)} onChange={b=>change(x=>{x.items=b?[...x.items,{...newLetteringItem(role),...(role==='個人名'?{personal:newPersonalNames()}:{})}]:x.items.filter(t=>t.role!==role);if(role==='会社名'&&!b){const p=x.items.find(t=>t.role==='個人名')?.personal;if(p){p.noName=false;p.place='異なる場所'}}})}/>)}</div>
 {v.items.map(t=>{const fontText=t.personal?personalText(t.personal):t.text;const c=threadColors.find(c=>c.number===t.thread)!;const appearance=<> <p className="muted">文字の種類：{characterKinds(fontText).join('・')||'未入力'}。共通して使える書体から1つ選択します。</p><div className="grid2"><Choice label={`${t.role}の書体`} id={`${s.id}-${t.role}-font`} value={allowedLetteringFonts(fontText).includes(canonicalFont(t.font))?canonicalFont(t.font):'書体を選び直してください'} options={allowedLetteringFonts(fontText)} onChange={a=>itemChange(t.role,x=>{x.font=a})}/><Choice label="文字サイズ（高さ）" value={`${t.size} mm`} options={Array.from({length:41},(_,i)=>`${i+10} mm`)} onChange={a=>itemChange(t.role,x=>{x.size=parseInt(a)})}/></div>
 <p className="muted">文字の縦寸法は12mmが一般的です。10mm以上でお選びください。</p>
 <button className="thread-choice" onClick={()=>setPicker(t.role)} aria-label={`${t.role}の糸色を選ぶ`}><span className="swatch" style={{background:c.hex}}/><span><b>{c.name}</b><small>糸番号 {c.number}</small></span><span className="pick-link">色見本から選ぶ</span></button>
</>;return <div className="lettering-item" key={t.role}>
 {t.role==='個人名'&&appearance}
 {t.role==='個人名'?<div id={`${s.id}-lettering-${t.role}`} tabIndex={-1}><PersonalNamesEditor value={t.personal||newPersonalNames(t.text)} hasCompany={v.items.some(a=>a.role==='会社名')} change={fn=>itemChange(t.role,x=>{x.personal=x.personal||newPersonalNames(x.text);fn(x.personal);if(!v.items.some(a=>a.role==='会社名')){x.personal.place='異なる場所';x.personal.noName=false}x.text=previewName(x.personal);if(!allowedLetteringFonts(personalText(x.personal)).includes(canonicalFont(x.font)))x.font='楷書体'})}/></div>:<> <label className="field" htmlFor={`${s.id}-lettering-${t.role}`}>{t.role}の刺繍文字 <em>必須</em><input id={`${s.id}-lettering-${t.role}`} value={t.text} maxLength={80} aria-required="true" placeholder={t.role==='会社名'?'例：株式会社 山口建設':'例：山田 太郎'} onChange={e=>itemChange(t.role,x=>{x.text=e.target.value;if(!allowedLetteringFonts(x.text).includes(canonicalFont(x.font)))x.font='楷書体'})}/></label></>}

 {t.role!=='個人名'&&appearance}
 {hasLetteringGap(t,v)&&<div className="grid2">{t.role!=='個人名'&&<Choice label="ロゴに対する配置" value={t.position} options={letteringPositions} onChange={a=>itemChange(t.role,x=>{x.position=a})}/>}<Choice label="間隔" value={`${t.gap} mm`} options={Array.from({length:201},(_,i)=>`${i} mm`)} onChange={a=>itemChange(t.role,x=>{x.gap=parseInt(a)})}/></div>}
 </div>})}
 <GuideEditor value={v.guide||{kind:'ポケット',slope:'右上がり'} as const} onChange={g=>change(x=>{x.guide=g;if(g.kind==='基準なし'){x.logoDirection='地面に水平';x.items.forEach(t=>{if(!t.personal||t.personal.place!=='異なる場所')t.direction='地面に水平'})}})} label="ロゴ・会社名の基準"/>
 {['ロゴ',...v.items.filter(t=>!t.personal?.noName).map(t=>t.role)].map(target=>{const item=v.items.find(t=>t.role===target);const separate=target==='個人名'&&item?.personal&&(item.personal.place==='異なる場所'||!v.items.some(t=>t.role==='会社名'));const guide=separate?(item.guide||{kind:'基準なし',slope:'分からない'} as const):(v.guide||{kind:'ポケット',slope:'右上がり'} as const);return <div key={target}>
 {separate&&<GuideEditor label="個人名の別部位の基準" value={guide} onChange={g=>itemChange(target,t=>{t.guide=g;if(g.kind==='基準なし')t.direction='地面に水平'})}/>}
 <fieldset className="lettering-direction"><legend>{target}の向き</legend><div className="grid2">{(['ポケット・縫い目の角度に合わせる','地面に水平'] as const).filter(d=>guide.kind!=='基準なし'||d==='地面に水平').map(direction=><button type="button" key={direction} className="direction-option" aria-pressed={(guide.kind==='基準なし'?'地面に水平':target==='ロゴ'?(v.logoDirection||'地面に水平'):(item?.direction||v.direction||'地面に水平'))===direction} onClick={()=>change(x=>{if(target==='ロゴ')x.logoDirection=direction;else{const t=x.items.find(t=>t.role===target);if(t)t.direction=direction}if(!x.guide)x.guide={kind:'ポケット',slope:'右上がり'}})}>{direction==='地面に水平'?direction:'基準に合わせる'}</button>)}</div></fieldset></div>})}
 <p className="muted">傾き・ポケットの形・刺繍との距離は参考表示です。実際の商品に合わせて仕上げます。「分からない」は実物確認後に調整します。</p>
 <Dialog open={picker!==null} onOpenChange={b=>{if(!b)setPicker(null)}}><DialogContent className="thread-dialog" showCloseButton={false}><DialogClose className="thread-close" aria-label="色見本を閉じる">×</DialogClose><DialogTitle>{picker}の糸色</DialogTitle><DialogDescription>色見本から糸色・糸番号を選んでください。</DialogDescription><div className="thread-grid">{threadColors.map(c=><button key={c.number} className="thread-sample" aria-pressed={v.items.find(t=>t.role===picker)?.thread===c.number} onClick={()=>{if(picker)itemChange(picker,x=>{x.thread=c.number});setPicker(null)}}><span className="swatch" style={{background:c.hex}}/><span><b>{c.name}</b><small>糸番号 {c.number}</small></span></button>)}</div></DialogContent></Dialog>
 </>}
 </section>;
}
