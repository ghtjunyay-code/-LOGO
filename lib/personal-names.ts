export type NameRow={id:string;size:string;quantity:number;last:string;first:string};
export type PersonalNames={centerBasis?:'ロゴ＋会社名全体の中央'|'会社名の中央';place:'同じ場所'|'異なる場所';location:string;other:string;position:string;align:string;noName:boolean;previewId:string;rows:NameRow[]};
export const nameRow=():NameRow=>({id:crypto.randomUUID(),size:'M',quantity:1,last:'',first:''});
export function newPersonalNames(text=''):PersonalNames{const row=nameRow();row.last=text;return {place:'同じ場所',location:'左肩',other:'',position:'下',align:'中央寄せ',noName:false,previewId:row.id,rows:[row]};}
export const rowName=(r:NameRow)=>[r.last.trim(),r.first.trim()].filter(Boolean).join(' ');
export function previewName(p:PersonalNames){if(p.noName)return '';return rowName(p.rows.find(r=>r.id===p.previewId)||p.rows[0]);}
export function personalText(p:PersonalNames){return p.noName?'':p.rows.map(rowName).join(' ');}
export function personalSummary(p:PersonalNames){return `個人名を入れる場所：${p.place==='同じ場所'?`会社名と同じ場所／会社名の${p.position}／${p.align}${p.align==='中央寄せ'&&['上','下'].includes(p.position)?`（${p.centerBasis||'会社名の中央'}）`:''}`:`会社名と異なる場所／${p.location==='その他'?p.other:p.location}`}\n`+p.rows.map(r=>`${r.size}・${r.quantity}着：${p.noName?'個人名なし（会社名のみ）':rowName(r)}`).join('\n')+`\n合計数量：${p.rows.reduce((n,r)=>n+r.quantity,0)}着`;}
export function parsePersonalNames(raw:unknown):PersonalNames{
 const fail=():never=>{throw new Error('個人名の内訳を確認してください')};if(!raw||typeof raw!=='object')return fail();const p=raw as PersonalNames;
 if(!['同じ場所','異なる場所'].includes(p.place)||!['上','下','左','右'].includes(p.position)||!['左寄せ','中央寄せ','右寄せ'].includes(p.align)||typeof p.noName!=='boolean'||typeof p.location!=='string'||p.location.length>100||typeof p.other!=='string'||p.other.length>300||typeof p.previewId!=='string'||!Array.isArray(p.rows)||p.rows.length<1||p.rows.length>100)return fail();
 if(p.centerBasis!==undefined&&!['ロゴ＋会社名全体の中央','会社名の中央'].includes(p.centerBasis))return fail();
 const ids=new Set();const rows=p.rows.map(r=>{if(!r||typeof r.id!=='string'||!r.id||r.id.length>64||ids.has(r.id)||typeof r.size!=='string'||r.size.length>50||!Number.isInteger(r.quantity)||r.quantity<1||r.quantity>50||typeof r.last!=='string'||typeof r.first!=='string'||r.last.length+r.first.length>80)return fail();ids.add(r.id);return {id:r.id,size:r.size,quantity:r.quantity,last:r.last,first:r.first}});
 return {...(p.centerBasis?{centerBasis:p.centerBasis}:{}),place:p.place,location:p.location,other:p.other,position:p.position,align:p.align,noName:p.noName,previewId:ids.has(p.previewId)?p.previewId:rows[0].id,rows};
}
