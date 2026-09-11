import {threadColors} from './thread-colors.ts';
export const letteringFonts=['楷書体','ゴシック'];
export const letteringPositions=['上','下','左','右'];
export type LetteringItem={role:'会社名'|'個人名';text:string;font:string;size:number;thread:string;position:string;gap:number;angle:number};
export type Lettering={enabled:boolean;pocketAngle:number;items:LetteringItem[]};
export const newLetteringItem=(role:LetteringItem['role']):LetteringItem=>({role,text:'',font:'楷書体',size:12,thread:'1197',position:'下',gap:5,angle:0});
export function parseLettering(raw:unknown):Lettering{
 const fail=():never=>{throw new Error('追加する文字の設定を確認してください')};
 if(!raw||typeof raw!=='object')return fail();const v=raw as Lettering;
 const num=(n:unknown,min:number,max:number)=>typeof n==='number'&&Number.isFinite(n)&&n>=min&&n<=max;
 if(typeof v.enabled!=='boolean'||!num(v.pocketAngle,-45,45)||!Array.isArray(v.items)||v.items.length>2)return fail();
 const seen=new Set();const items=v.items.map(t=>{if(!t||!['会社名','個人名'].includes(t.role)||seen.has(t.role)||typeof t.text!=='string'||t.text.length>80||!letteringFonts.includes(t.font)||!threadColors.some(c=>c.number===t.thread)||!letteringPositions.includes(t.position)||!num(t.size,3,50)||!num(t.gap,0,200)||!num(t.angle,-180,180))return fail();seen.add(t.role);return {role:t.role,text:t.text,font:t.font,size:t.size,thread:t.thread,position:t.position,gap:t.gap,angle:t.angle}});
 return {enabled:v.enabled,pocketAngle:v.pocketAngle,items};
}
export function letteringSummary(v?:Lettering){if(!v?.enabled)return '';return `ポケット基準線：水平から ${v.pocketAngle}°\n`+v.items.map(t=>`${t.role}：${t.text}\n${t.font}／文字高さ ${t.size} mm／${threadColors.find(c=>c.number===t.thread)?.name}（糸番号 ${t.thread}）\n配置：ロゴの${t.position}／間隔 ${t.gap} mm／ポケット基準線に対し ${t.angle}°`).join('\n');}
// Shared millimetre layout for the on-screen composition and PDF.
export function letteringLayout(width:number,height:number,v:Lettering){
 const w=width>0?width:60,h=height>0?height:40;const edges={上:-h/2,下:h/2,左:-w/2,右:w/2};
 const items=v.items.filter(t=>t.text.trim()).map(t=>{const tw=Math.max(t.size,Array.from(t.text).reduce((n,c)=>n+(/[\x00-\x7f]/.test(c)?0.6:1),0)*t.size),th=t.size;const angle=t.angle+v.pocketAngle,r=angle*Math.PI/180;const bw=Math.abs(tw*Math.cos(r))+Math.abs(th*Math.sin(r)),bh=Math.abs(tw*Math.sin(r))+Math.abs(th*Math.cos(r));let x=0,y=0;const pos=t.position as keyof typeof edges;if(pos==='上'){y=edges.上-t.gap-bh/2;edges.上=y-bh/2}else if(pos==='下'){y=edges.下+t.gap+bh/2;edges.下=y+bh/2}else if(pos==='左'){x=edges.左-t.gap-bw/2;edges.左=x-bw/2}else{x=edges.右+t.gap+bw/2;edges.右=x+bw/2}return {...t,x,y,tw,th,bw,bh,rotation:angle,color:threadColors.find(c=>c.number===t.thread)!.hex}});
 const minX=Math.min(-w/2,...items.map(t=>t.x-t.bw/2)),maxX=Math.max(w/2,...items.map(t=>t.x+t.bw/2)),minY=Math.min(-h/2,...items.map(t=>t.y-t.bh/2)),maxY=Math.max(h/2,...items.map(t=>t.y+t.bh/2));
 return {w,h,items,minX,maxX,minY,maxY,width:maxX-minX,height:maxY-minY};
}
