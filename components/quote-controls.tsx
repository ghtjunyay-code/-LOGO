'use client';
import {useId} from 'react';
import {Select,SelectTrigger,SelectValue,SelectContent,SelectItem} from '@/components/ui/select';
import {Checkbox} from '@/components/ui/checkbox';
import {assetUrl} from '@/lib/client';
import type {Spot} from '@/lib/quote';
export function Field({label,value,onChange,id,required=false,type='text',placeholder='',min,step}: {label:string;value:string;onChange:(v:string)=>void;id?:string;required?:boolean;type?:string;placeholder?:string;min?:string;step?:string}){const generated=useId();const key=id||generated;return <label className="field" htmlFor={key}>{label}{required&&<em>必須</em>}<input id={key} value={value} onChange={e=>onChange(e.target.value)} type={type} placeholder={placeholder} min={min} step={step} maxLength={type==='number'?undefined:500} aria-required={required}/></label>}
export function Choice({label,value,onChange,options,id,disabled=[]}:{label:string;value:string;onChange:(v:string)=>void;options:string[];id?:string;disabled?:string[]}){const key=useId();return <div className="field"><label id={`${id||key}-label`} htmlFor={id||key}>{label}</label><Select value={value} onValueChange={v=>onChange(v||'')}><SelectTrigger id={id||key} aria-labelledby={`${id||key}-label`}><SelectValue>{value||'選択してください'}</SelectValue></SelectTrigger><SelectContent>{options.map(v=><SelectItem key={v} value={v} disabled={disabled.includes(v)}>{v}</SelectItem>)}</SelectContent></Select></div>}
export function Check({label,checked,onChange,id}:{label:string;checked:boolean;onChange:(v:boolean)=>void;id?:string}){const key=useId();return <label className="checkrow" htmlFor={id||key}><Checkbox id={id||key} checked={checked} onCheckedChange={v=>onChange(!!v)}/><span>{label}</span></label>}
export function Notes({label,value,onChange,id}:{label:string;value:string;onChange:(v:string)=>void;id?:string}){const key=useId();return <label className="field" htmlFor={id||key}>{label}<textarea id={id||key} value={value} onChange={e=>onChange(e.target.value)} maxLength={5000}/></label>}
export function LogoPreview({spot,background='#ffffff'}:{spot:Spot;background?:string}){
 if(!spot.asset)return null;const ratio=Number(spot.width)>0&&Number(spot.height)>0?Number(spot.width)/Number(spot.height):spot.asset.width/spot.asset.height;
 const w=Math.min(260,180*ratio),h=w/ratio,x=(350-w)/2,y=30+(180-h)/2;
 return <><div className="logo-dimension"><svg viewBox="0 0 400 280" role="img" aria-label={`仕上がりイメージ：横 ${spot.width||'未指定'} mm、縦 ${spot.height||'未指定'} mm`}>
 <rect x={x-12} y={y-12} width={w+24} height={h+24} fill={background} stroke="#bfcbd6"/><image href={assetUrl(spot.asset)} x={x} y={y} width={w} height={h} preserveAspectRatio="none"/>
 <g stroke="#346386" strokeWidth="1"><path d={`M ${x} ${y+h+19} v 10 m 0 -5 h ${w} m 0 -5 v 10`}/><path d={`M ${x+w+19} ${y} h 10 m -5 0 v ${h} m -5 0 h 10`}/></g>
 <text x={x+w/2} y={y+h+46} textAnchor="middle" fill="#192d42" fontSize="14">横 {spot.width||'未指定'} mm</text><text transform={`translate(${x+w+44},${y+h/2}) rotate(90)`} textAnchor="middle" fill="#192d42" fontSize="14">縦 {spot.height||'未指定'} mm</text>
 </svg></div><p className="muted">ボディ色を背景にした寸法の参考図です。画像内の白背景はそのまま表示します。</p></>;
}
