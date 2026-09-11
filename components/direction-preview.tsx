'use client';
import {fontFamily} from '@/lib/lettering-fonts';
import {letteringLayout,type Lettering} from '@/lib/lettering';
import {displayAsset,type Spot} from '@/lib/quote';
import {assetUrl} from '@/lib/client';
import {previewName} from '@/lib/personal-names';
import {threadColors} from '@/lib/thread-colors';
export default function DirectionPreview({spot:s,direction,target,background='#ffffff'}:{background?:string;spot:Spot;target:string;direction:Lettering['direction']}){
 if(!s.asset||!s.lettering)return null;
 if(target==='個人名'){
 const person=s.lettering.items.find(t=>t.role==='個人名');
 if(!person)return null;
 const name=person.personal?previewName(person.personal):person.text;
 const textWidth=Math.max(person.size,Array.from(name).reduce((n,c)=>n+(/[\x00-\x7f]/.test(c)?0.6:1),0)*person.size);
 const scale=Math.min(164/textWidth,26/person.size),rotation=direction==='ポケット・縫い目の角度に合わせる'?-10:0;
 return <svg className="pocket-option-preview" viewBox="0 0 220 170" role="img" aria-label={`${direction}：個人名「${name}」の配置例`}>
 <rect width="220" height="170" rx="10" fill={background}/>
 <svg x="72" y="108" width="76" height="58" viewBox="375 88 80 60" overflow="hidden"><image href="/pocket-reference.png" width="597" height="187"/></svg>
 {name?<text transform={`translate(110 55) rotate(${rotation}) scale(${scale})`} y={person.size*.36} textAnchor="middle" fill={threadColors.find(c=>c.number===person.thread)?.hex} fontSize={person.size} fontFamily={fontFamily(person.font)} fontStyle={person.font==='イタリック体'?'italic':'normal'} textLength={textWidth} lengthAdjust="spacingAndGlyphs">{name}</text>:<><rect x="20" y="36" width="180" height="35" rx="5" fill="white"/><text x="110" y="58" textAnchor="middle" fill="#23384d" fontSize="13">{person.personal?.noName?'個人名なし':'個人名を入力してください'}</text></>}
 </svg>;
 }
 const l=letteringLayout(Number(s.width),Number(s.height),{...s.lettering,...(target==='ロゴ'?{logoDirection:direction}:{items:s.lettering.items.map(t=>t.role===target?{...t,direction}:t)})});
 const scale=Math.min(164/l.width,82/l.height),cx=(l.minX+l.maxX)/2,cy=(l.minY+l.maxY)/2;
 return <svg className="pocket-option-preview" viewBox="0 0 220 170" role="img" aria-label={`${direction}：選択中のロゴと文字の配置例`}>
 <rect width="220" height="170" rx="10" fill={background}/>
 {/* Display only the supplied pocket illustration; its sample lettering stays outside the viewport. */}
 <svg x="72" y="108" width="76" height="58" viewBox="375 88 80 60" overflow="hidden"><image href="/pocket-reference.png" width="597" height="187"/></svg>
 <g transform={`translate(110 55) scale(${scale}) translate(${-cx} ${-cy})`}>
 <image href={assetUrl(displayAsset(s.asset))} x={-l.w/2} y={-l.h/2} width={l.w} height={l.h} transform={`rotate(${l.logoRotation})`}/>
 {l.items.map(t=><text key={t.role} transform={`translate(${t.x} ${t.y}) rotate(${t.rotation})`} y={t.size*.36} textAnchor="middle" fill={t.color} fontSize={t.size} fontFamily={fontFamily(t.font)} fontStyle={t.font==='イタリック体'?'italic':'normal'} textLength={t.tw} lengthAdjust="spacingAndGlyphs">{t.text}</text>)}
 </g></svg>;
}
