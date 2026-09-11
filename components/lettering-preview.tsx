'use client';
import {letteringLayout} from '@/lib/lettering';
import {displayAsset,type Spot} from '@/lib/quote';
import {assetUrl} from '@/lib/client';
export default function LetteringPreview({spot:s,background}:{spot:Spot;background:string}){
 if(!s.asset||!s.lettering?.enabled)return null;const l=letteringLayout(Number(s.width),Number(s.height),s.lettering),pad=Math.max(l.width,l.height)*.12+5;const guideY=l.maxY+pad*.65,guideW=l.width*.7,r=s.lettering.pocketAngle*Math.PI/180;
 return <><div className="logo-dimension"><svg viewBox={`${l.minX-pad} ${l.minY-pad} ${l.width+pad*2} ${l.height+pad*2+Math.abs(guideW/2*Math.sin(r))}`} role="img" aria-label="ロゴと会社名・個人名の配置プレビュー"><rect x={l.minX-pad} y={l.minY-pad} width={l.width+pad*2} height={l.height+pad*2+Math.abs(guideW/2*Math.sin(r))} fill={background}/><image href={assetUrl(displayAsset(s.asset))} x={-l.w/2} y={-l.h/2} width={l.w} height={l.h}/>{l.items.map(t=><text key={t.role} transform={`translate(${t.x},${t.y}) rotate(${t.rotation})`} y={t.size*.36} textAnchor="middle" fill={t.color} fontSize={t.size} fontFamily={t.font==='ゴシック'?"'Yu Gothic',sans-serif":"'KaiTi','Kaiti SC','Yu Mincho',serif"} textLength={t.tw} lengthAdjust="spacingAndGlyphs">{t.text}</text>)}<line x1={(l.minX+l.maxX)/2-guideW/2*Math.cos(r)} y1={guideY-guideW/2*Math.sin(r)} x2={(l.minX+l.maxX)/2+guideW/2*Math.cos(r)} y2={guideY+guideW/2*Math.sin(r)} stroke="#8094a5" strokeWidth={.5} strokeDasharray="2 2"/></svg></div><p className="muted">ロゴ：横 {s.width||'未指定'} × 縦 {s.height||'未指定'} mm。点線はポケット角度の基準です。書体と文字幅は参考表示で、実際の刺繍書体・寸法は刺繍屋さんが確認します。</p></>;
}
