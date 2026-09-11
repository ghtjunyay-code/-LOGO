// Transcribed from the user's supplied picker screenshot. RGB is a screen sample,
// not a manufacturer colorimetric measurement. Unseen catalog rows are not invented.
export const threadColors = [
 // Preserve the three additional colors already registered in the site.
 {number:'1005',name:'ピンク',hex:'#b52f67'},
 {number:'1359',name:'ショッキングピンク',hex:'#9b174f'},
 {number:'9022',name:'レッド',hex:'#b73527'},
 {number:'9324',name:'ダークレッド',hex:'#8f2525'},
 {number:'1113',name:'オレンジ',hex:'#b95d2c'},
 {number:'1098',name:'マスタードゴールド',hex:'#b88a3c'},
 {number:'1094',name:'黄色',hex:'#f2df00'},
 {number:'2218',name:'ブラック',hex:'#34383a'},
 {number:'9026',name:'エンジ色',hex:'#493235'},
 {number:'1168',name:'くすみピンク',hex:'#a97878'},
 {number:'1189',name:'濃紺',hex:'#172036'},
 {number:'1039',name:'ネイビー',hex:'#101b4b'},
 {number:'1038',name:'インディゴブルー',hex:'#142758'},
 {number:'1036',name:'ブルー',hex:'#174b9a'},
 {number:'1245',name:'水色',hex:'#45a5cf'},
 {number:'1033',name:'ペールブルー',hex:'#759ab5'},
 {number:'1079',name:'ダークグリーン',hex:'#102e2a'},
 {number:'1061',name:'グリーン',hex:'#096340'},
 {number:'1058',name:'オリーブグリーン',hex:'#31803d'},
 {number:'1442',name:'ブルーグレー',hex:'#40576b'},
 {number:'1610',name:'濃いグレー',hex:'#34313c'},
 {number:'1141',name:'シルバーグレー',hex:'#9a9c9d'},
 {number:'1128',name:'ムラサキ',hex:'#4c247c'},
 {number:'2614',name:'藤色',hex:'#76647e'},
 {number:'1817',name:'青紫',hex:'#292360'},
 {number:'1197',name:'黒',hex:'#111216'},
 {number:'1198',name:'白',hex:'#f4f3ed'},
 {number:'113',name:'ゴールド',hex:'#c6a122'},
 {number:'101',name:'シルバー',hex:'#a5a5a3'},
];
export type ThreadSelection={source:string;number:string;confirmed?:boolean};
export function sourceColorName(hex:string){const [r,g,b]=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255),max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min;if(max<.22)return '黒';if(d<.1)return min>.86?'白':'グレー';let h=(max===r?(g-b)/d:max===g?2+(b-r)/d:4+(r-g)/d)*60;h=(h+360)%360;if(h<18||h>=345)return max>.75&&min>.35?'ピンク':'赤';if(h<45)return max<.6?'茶色':'オレンジ';if(h<72)return '黄色';if(h<165)return '緑';if(h<205)return '水色';if(h<260)return '青';if(h<290)return '紫';return 'ピンク'}
export function suggestedThreads(data:Uint8ClampedArray):ThreadSelection[]{const names=new Set<string>();return detectPalette(data).filter(source=>{const name=sourceColorName(source);if(names.has(name))return false;names.add(name);return true}).map(source=>({source,number:nearestThread(source).number,confirmed:false}))}
export function lab(hex:string){
 const [r,g,b]=[1,3,5].map(i=>{const v=parseInt(hex.slice(i,i+2),16)/255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4});
 const f=(v:number)=>v>.008856?Math.cbrt(v):7.787*v+16/116;
 const x=f((.4124564*r+.3575761*g+.1804375*b)/.95047),y=f(.2126729*r+.7151522*g+.072175*b),z=f((.0193339*r+.119192*g+.9503041*b)/1.08883);
 return [116*y-16,500*(x-y),200*(y-z)];
}
export const colorDistance=(a:string,b:string)=>{const x=lab(a),y=lab(b);return Math.hypot(...x.map((v,i)=>v-y[i]))};
export function nearestThread(hex:string){return threadColors.reduce((best,c)=>colorDistance(hex,c.hex)<colorDistance(hex,best.hex)?c:best)}
export function threadText(rows:ThreadSelection[]){return rows.map(r=>threadColors.find(c=>c.number===r.number)).filter((c,i,a)=>c&&a.findIndex(x=>x?.number===c.number)===i).map(c=>`${c!.name}（糸番号 ${c!.number}）`).join('、')}
export function detectPalette(data:Uint8ClampedArray){
 // Small RGB bins suppress compression noise; nearby Lab colors merge. Preserve
 // opaque white (it may be actual artwork), but ignore fully transparent RGB.
 const bins=new Map<string,{n:number;r:number;g:number;b:number}>();
 for(let i=0;i<data.length;i+=4){if(data[i+3]<128)continue;const key=[0,1,2].map(k=>Math.floor(data[i+k]/16)).join(',');const b=bins.get(key)||{n:0,r:0,g:0,b:0};b.n++;b.r+=data[i];b.g+=data[i+1];b.b+=data[i+2];bins.set(key,b)}
 const hex=(r:number,g:number,b:number)=>'#'+[r,g,b].map(v=>Math.round(v).toString(16).padStart(2,'0')).join('');
 const clusters:{hex:string;n:number}[]=[];
 for(const b of [...bins.values()].sort((a,b)=>b.n-a.n)){const h=hex(b.r/b.n,b.g/b.n,b.b/b.n);const old=clusters.find(c=>colorDistance(c.hex,h)<12);if(old)old.n+=b.n;else clusters.push({hex:h,n:b.n})}
 const total=clusters.reduce((n,c)=>n+c.n,0);
 return clusters.filter(c=>c.n>=Math.max(1,total*.002)).sort((a,b)=>b.n-a.n).slice(0,24).map(c=>c.hex);
}
export async function analyzeLogo(url:string){
 const img=await new Promise<HTMLImageElement>((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(new Error('ロゴを読み込めませんでした。再試行してください。'));i.src=url});
 const scale=Math.min(1,320/Math.max(img.naturalWidth,img.naturalHeight));const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.naturalWidth*scale));canvas.height=Math.max(1,Math.round(img.naturalHeight*scale));const ctx=canvas.getContext('2d',{willReadFrequently:true});if(!ctx)throw new Error('この端末では自動判別できません。色見本から選択してください。');ctx.drawImage(img,0,0,canvas.width,canvas.height);
 return suggestedThreads(ctx.getImageData(0,0,canvas.width,canvas.height).data);
}
