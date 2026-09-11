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
 const l=letteringLayout(Number(s.width),Number(s.height),v),pad=Math.max(l.width,l.height,110)*.12+5,gw=110,gy=l.maxY+pad+gw*.1;
 const viewWidth=Math.max(l.width,guide.kind==='基準なし'?0:132)+pad*2,viewX=(l.minX+l.maxX-viewWidth)/2;
 const totalHeight=l.height+pad*2+(guide.kind==='基準なし'?0:gw*.62);
 return <><div className="logo-dimension"><svg viewBox={`${viewX} ${l.minY-pad} ${viewWidth} ${totalHeight}`} role="img" aria-label="ロゴと会社名・個人名、ポケット・縫い目の配置プレビュー">
 <rect x={viewX} y={l.minY-pad} width={viewWidth} height={totalHeight} fill={background}/>
 <image href={assetUrl(displayAsset(s.asset))} x={-l.w/2} y={-l.h/2} width={l.w} height={l.h} transform={`rotate(${l.logoRotation})`}/>
 {l.items.map(t=><text key={t.role} transform={`translate(${t.x},${t.y}) rotate(${t.rotation})`} y={t.size*.36} textAnchor="middle" fill={t.color} fontSize={t.size} fontFamily={fontFamily(t.font)} fontStyle={t.font==='イタリック体'?'italic':'normal'} textLength={t.tw} lengthAdjust="spacingAndGlyphs">{t.text}</text>)}
 <GuideOutline guide={guide} background={background} x={(l.minX+l.maxX)/2} y={gy} width={gw}/></svg></div>
 <p className="muted">ロゴ：横 {s.width||'未指定'} × 縦 {s.height||'未指定'} mm。{guideSummary(guide)}。形・傾き・距離と書体は参考表示です。実際の商品に合わせて仕上げます。</p>
 {v.items.filter(t=>t.personal&&!t.personal.noName&&(t.personal.place==='異なる場所'||!v.items.some(c=>c.role==='会社名'))).map(t=>{const g=t.guide||{kind:'基準なし',slope:'分からない'} as EmbroideryGuide;const name=previewName(t.personal!);const tw=Math.max(t.size,Array.from(name).reduce((n,c)=>n+(/[\x00-\x7f]/.test(c)?0.6:1),0)*t.size);const angle=(t.direction||v.direction)==='ポケット・縫い目の角度に合わせる'?guideAngle(g):0;const radians=angle*Math.PI/180,bw=Math.abs(tw*Math.cos(radians))+Math.abs(t.size*Math.sin(radians)),bh=Math.abs(tw*Math.sin(radians))+Math.abs(t.size*Math.cos(radians));const vw=Math.max(bw,132)+32,gy=bh/2+26,vh=bh+32+(g.kind==='基準なし'?0:85);return <div className="review-block" key={t.role}><b>個人名の別部位：{t.personal!.location==='その他'?t.personal!.other:t.personal!.location}</b><svg viewBox={`${-vw/2} ${-bh/2-16} ${vw} ${vh}`} style={{width:'100%',display:'block'}} role="img" aria-label={`個人名 ${name} の別部位プレビュー`}><rect x={-vw/2} y={-bh/2-16} width={vw} height={vh} fill={background}/><text transform={`rotate(${angle})`} y={t.size*.36} textAnchor="middle" fill={threadColors.find(c=>c.number===t.thread)?.hex} fontSize={t.size} fontFamily={fontFamily(t.font)} fontStyle={t.font==='イタリック体'?'italic':'normal'} textLength={name?tw:undefined} lengthAdjust="spacingAndGlyphs">{name}</text><GuideOutline guide={g} background={background} x={0} y={gy} width={110}/></svg><p className="muted">{t.font}・文字高さ {t.size} mm・{g.kind==='基準なし'?'地面に水平':t.direction||v.direction||'地面に水平'}。{guideSummary(g)}。形・傾き・距離は参考表示です。</p></div>})}</>;
}
