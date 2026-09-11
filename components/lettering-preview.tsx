'use client';
import {previewName} from '@/lib/personal-names';
import {threadColors} from '@/lib/thread-colors';
import {fontFamily} from '@/lib/lettering-fonts';
import {letteringLayout} from '@/lib/lettering';
import {guideAngle,guideSummary,type EmbroideryGuide} from '@/lib/embroidery-guide';
import GuideOutline from './guide-outline';
import {displayAsset,type Spot} from '@/lib/quote';
import {assetUrl} from '@/lib/client';
export default function LetteringPreview({spot:s,background}:{spot:Spot;background:string}){
 if(!s.asset||!s.lettering?.enabled)return null;
 const v=s.lettering,guide=v.guide||{kind:'ポケット',slope:'右上がり'} as EmbroideryGuide;
 const l=letteringLayout(Number(s.width),Number(s.height),v),pad=Math.max(l.width,l.height)*.12+5,gw=l.width*.65,gy=l.maxY+pad+gw*.1;
 const totalHeight=l.height+pad*2+(guide.kind==='基準なし'?0:gw*.62);
 return <><div className="logo-dimension"><svg viewBox={`${l.minX-pad} ${l.minY-pad} ${l.width+pad*2} ${totalHeight}`} role="img" aria-label="ロゴと会社名・個人名、ポケット・縫い目の配置プレビュー">
 <rect x={l.minX-pad} y={l.minY-pad} width={l.width+pad*2} height={totalHeight} fill={background}/>
 <image href={assetUrl(displayAsset(s.asset))} x={-l.w/2} y={-l.h/2} width={l.w} height={l.h} transform={`rotate(${l.logoRotation})`}/>
 {l.items.map(t=><text key={t.role} transform={`translate(${t.x},${t.y}) rotate(${t.rotation})`} y={t.size*.36} textAnchor="middle" fill={t.color} fontSize={t.size} fontFamily={fontFamily(t.font)} fontStyle={t.font==='イタリック体'?'italic':'normal'} textLength={t.tw} lengthAdjust="spacingAndGlyphs">{t.text}</text>)}
 <GuideOutline guide={guide} background={background} x={(l.minX+l.maxX)/2} y={gy} width={gw}/></svg></div>
 <p className="muted">ロゴ：横 {s.width||'未指定'} × 縦 {s.height||'未指定'} mm。{guideSummary(guide)}。形・傾き・距離と書体は参考表示です。実際の商品に合わせて仕上げます。</p>
 {v.items.filter(t=>t.personal&&!t.personal.noName&&(t.personal.place==='異なる場所'||!v.items.some(c=>c.role==='会社名'))).map(t=>{const g=t.guide||{kind:'基準なし',slope:'分からない'} as EmbroideryGuide;const name=previewName(t.personal!);const tw=Math.max(t.size,Array.from(name).reduce((n,c)=>n+(/[\x00-\x7f]/.test(c)?0.6:1),0)*t.size);const scale=Math.min(260/tw,26/t.size);const angle=(t.direction||v.direction)==='ポケット・縫い目の角度に合わせる'?guideAngle(g):0;return <div className="review-block" key={t.role}><b>個人名の別部位：{t.personal!.location==='その他'?t.personal!.other:t.personal!.location}</b><svg viewBox={`0 0 360 ${g.kind==='基準なし'?100:175}`} style={{width:'100%',display:'block'}} role="img" aria-label={`個人名 ${name} の別部位プレビュー`}><rect width="360" height="175" fill={background}/><text transform={`translate(180 50) rotate(${angle}) scale(${scale})`} y={t.size*.36} textAnchor="middle" fill={threadColors.find(c=>c.number===t.thread)?.hex} fontSize={t.size} fontFamily={fontFamily(t.font)} fontStyle={t.font==='イタリック体'?'italic':'normal'} textLength={name?tw:undefined} lengthAdjust="spacingAndGlyphs">{name}</text><GuideOutline guide={g} background={background} x={180} y={95} width={130}/></svg><p className="muted">{t.font}・文字高さ {t.size} mm・{g.kind==='基準なし'?'地面に水平':t.direction||v.direction||'地面に水平'}。{guideSummary(g)}。形・傾き・距離は参考表示です。</p></div>})}</>;
}
