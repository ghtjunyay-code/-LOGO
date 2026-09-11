export type EmbroideryGuide={kind:'ポケット'|'縫い目'|'基準なし';slope:'水平'|'右上がり'|'右下がり'|'分からない'};
export const defaultGuide:EmbroideryGuide={kind:'ポケット',slope:'分からない'};
export function parseGuide(raw:unknown):EmbroideryGuide{const g=raw as EmbroideryGuide;if(!g||!['ポケット','縫い目','基準なし'].includes(g.kind)||!['水平','右上がり','右下がり','分からない'].includes(g.slope))throw new Error('ポケット・縫い目の設定を確認してください');return {kind:g.kind,slope:g.slope};}
export function guideAngle(g?:EmbroideryGuide){if(!g)return -10;return g.kind==='基準なし'?0:g.slope==='右上がり'?-10:g.slope==='右下がり'?10:0;}
export function guideSummary(g?:EmbroideryGuide){return !g?'基準：ポケット・縫い目（実物確認）':g.kind==='基準なし'?'基準なし':`基準：${g.kind}／${g.slope}${g.slope==='分からない'?'（実物確認後に調整）':''}`;}
