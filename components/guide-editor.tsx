'use client';
import {Choice} from './quote-controls';
import type {EmbroideryGuide} from '@/lib/embroidery-guide';
export default function GuideEditor({value,onChange,label}:{value:EmbroideryGuide;onChange:(g:EmbroideryGuide)=>void;label:string}){return <fieldset className="lettering-direction"><legend>{label}</legend><div className="grid2"><Choice label="基準にするもの" value={value.kind} options={['ポケット','縫い目','基準なし']} onChange={kind=>onChange({...value,kind:kind as EmbroideryGuide['kind']})}/>{value.kind!=='基準なし'&&<Choice label="ポケット・縫い目の傾き" value={value.slope} options={['水平','右上がり','右下がり','分からない']} onChange={slope=>onChange({...value,slope:slope as EmbroideryGuide['slope']})}/>}</div></fieldset>}
