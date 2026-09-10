export type Asset={id:string;name:string;type:string;width:number;height:number};
export type Spot={id:string;location:string;other:string;width:string;height:string;lock:boolean;threadMode:string;thread:string;pattern:string;reference:string;notes:string;asset:Asset|null};
export type Product={id:string;name:string;kind:string;sku:string;manageNo:string;color:string;material:string;sizes:{id:string;size:string;quantity:string}[];spots:Spot[]};
export type Quote={version:1;id:string;customerId:string;process:'logo-embroidery';sourceId:string|null;customer:{name:string;company:string;email?:string;phone:string;lineRegistration?:string};products:Product[];delivery:string;deliveryNotes:string;checked:boolean;step:number;updatedAt:string};
export type Issue={step:number;target:string;message:string};
export const steps=['お客様情報','商品情報','刺繍情報','必要納期','確認事項'];
export const sizes=['SS','S','M','L','LL','3L','4L','5L','6L','フリー'];
export const uid=()=>crypto.randomUUID();
export const newSize=()=>({id:uid(),size:'',quantity:''});
export const newSpot=():Spot=>({id:uid(),location:'左胸',other:'',width:'',height:'',lock:true,threadMode:'業者に相談',thread:'',pattern:'不明',reference:'',notes:'',asset:null});
export const newProduct=():Product=>({id:uid(),name:'',kind:'未指定',sku:'',manageNo:'',color:'',material:'',sizes:[newSize()],spots:[newSpot()]});
export const newQuote=():Quote=>({version:1,id:uid(),customerId:uid(),process:'logo-embroidery',sourceId:null,customer:{company:'',name:'',phone:''},products:[newProduct()],delivery:'',deliveryNotes:'',checked:false,step:1,updatedAt:new Date().toISOString()});
export function copyProduct(p:Product,withSpots:boolean):Product{return {...structuredClone(p),id:uid(),sizes:[newSize()],spots:withSpots?p.spots.map(s=>({...structuredClone(s),id:uid()})):[newSpot()]};}
export function subtotal(p:Product){return p.sizes.reduce((n,s)=>n+(s.size.trim()&&/^\d+$/.test(s.quantity)&&Number(s.quantity)>0?Number(s.quantity):0),0)}
export function total(q:Quote){return q.products.reduce((n,p)=>n+subtotal(p),0)}
export function duplicates(p:Product){const seen=new Set<string>();return p.sizes.filter(s=>{const k=s.size.trim().toUpperCase();if(!k)return false;if(seen.has(k))return true;seen.add(k);return false}).map(s=>s.size)}
export function validDate(value:string){if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;const d=new Date(value+'T12:00:00Z');return Number.isFinite(d.getTime())&&d.toISOString().slice(0,10)===value;}
export function fiveDaysBefore(value:string){if(!value)return '';if(!validDate(value))throw new Error('日付を確認してください');const d=new Date(value+'T12:00:00Z');d.setUTCDate(d.getUTCDate()-5);return d.toISOString().slice(0,10)}
export function deliveryText(q:Quote){return q.delivery?`商品受け取り希望日：${q.delivery}\n希望日の5日前（暦日）：${fiveDaysBefore(q.delivery)}\n上記日程での対応可否をご確認ください。`:'商品受け取り希望日：指定なし';}
export function reorder(q:Quote,mode:'same'|'product'|'embroidery'):Quote{return {...structuredClone(q),id:uid(),sourceId:q.id,products:q.products.map(p=>({...structuredClone(p),id:uid(),sizes:p.sizes.map(s=>({...s,id:uid()})),spots:p.spots.map(s=>({...structuredClone(s),id:uid()}))})),delivery:'',deliveryNotes:'',checked:false,step:mode==='product'?2:mode==='embroidery'?3:4,updatedAt:new Date().toISOString()};}
export function resizeSpot(s:Spot,axis:'width'|'height',value:string):Spot{const next={...s,[axis]:value};if(s.lock&&s.asset&&Number(value)>0){const ratio=s.asset.width/s.asset.height;next[axis==='width'?'height':'width']=String(Math.round((axis==='width'?Number(value)/ratio:Number(value)*ratio)*10)/10)}return next;}
export function validate(q:Quote):Issue[]{const out:Issue[]=[];const add=(step:number,target:string,message:string)=>out.push({step,target,message});
 if(!q.customer.company.trim())add(1,'customer-company','会社組織名を入力してください');
 if(!q.customer.name.trim())add(1,'customer-name','ご担当者様名を入力してください');
 if(!q.customer.phone.trim())add(1,'customer-phone','電話番号を入力してください');
 if(!q.products.length)add(3,'add-product','刺繍情報を1点以上追加してください');
 q.products.forEach((p,i)=>{const label=p.name||`刺繍対象${i+1}`;
 p.sizes.forEach(s=>{if(!s.size.trim()&&!s.quantity.trim())return;if(!s.size.trim())add(2,`${s.id}-size`,`${label}：数量を指定した行のサイズを入力してください`);if(!/^\d+$/.test(s.quantity)||Number(s.quantity)<1||!Number.isSafeInteger(Number(s.quantity)))add(2,`${s.id}-quantity`,`${label}：サイズを指定した行の数量は1以上の整数で入力してください`)});
 if(duplicates(p).length)add(2,`${p.id}-sizes`,`${label}：同じサイズが重複しています（${duplicates(p).join('、')}）`);
 if(!p.spots.length)add(3,`${p.id}-spots`,`${label}：刺繍箇所を追加してください`);
 p.spots.forEach((s,j)=>{const title=`${label}・箇所${j+1}`;if(!s.asset)add(3,`${s.id}-file`,`${title}：ロゴ原稿を選択してください`);if(s.location==='その他'&&!s.other.trim())add(3,`${s.id}-other`,`${title}：加工部位を入力してください`);for(const key of ['width','height'] as const)if(!Number.isFinite(Number(s[key]))||Number(s[key])<=0)add(3,`${s.id}-${key}`,`${title}：希望${key==='width'?'横幅':'高さ'}をmmで入力してください`);if(s.threadMode==='指定する'&&!s.thread.trim())add(3,`${s.id}-thread`,`${title}：希望糸色を入力してください`);if(s.pattern==='あり'&&!s.reference.trim())add(3,`${s.id}-reference`,`${title}：型データの参照番号または元依頼を入力してください`)});
 });if(q.delivery&&!validDate(q.delivery))add(4,'delivery','受け取り希望日を確認してください');if(!q.checked)add(5,'checked','確認事項にチェックしてください');return out;
}
// Strict shape validation at the API boundary; drafts may contain empty fields.
export function parseQuote(input:unknown):Quote{
 const fail=()=>{throw new Error('保存データの形式を確認してください')};const obj=(v:unknown):Record<string,unknown>=>v&&typeof v==='object'&&!Array.isArray(v)?v as Record<string,unknown>:fail();
 const str=(v:unknown,max=5000):string=>typeof v==='string'&&v.length<=max?v:fail();const id=(v:unknown)=>{const s=str(v,64);return /^[a-zA-Z0-9-]{1,64}$/.test(s)?s:fail()};const list=(v:unknown,max:number):unknown[]=>Array.isArray(v)&&v.length<=max?v:fail();const bool=(v:unknown)=>typeof v==='boolean'?v:fail();
 const enumStr=(v:unknown,values:string[])=>typeof v==='string'&&values.includes(v)?v:fail();const raw=obj(input),c=obj(raw.customer);
 if(raw.version!==1||raw.process!=='logo-embroidery')fail();
 const q:Quote={version:1,id:id(raw.id),customerId:id(raw.customerId),process:'logo-embroidery',sourceId:raw.sourceId===null?null:id(raw.sourceId),customer:{name:str(c.name,300),company:str(c.company,300),...(c.email!==undefined?{email:str(c.email,300)}:{}),phone:str(c.phone,100),...(c.lineRegistration!==undefined?{lineRegistration:enumStr(c.lineRegistration,['未選択','登録済み','登録する','登録しない'])}:{})},delivery:str(raw.delivery,10),deliveryNotes:str(raw.deliveryNotes),checked:bool(raw.checked),step:Number(raw.step),updatedAt:str(raw.updatedAt,40),products:list(raw.products,50).map(v=>{const p=obj(v);return {id:id(p.id),name:str(p.name,300),kind:str(p.kind,100),sku:str(p.sku,100),manageNo:str(p.manageNo,100),color:str(p.color,300),material:str(p.material,500),sizes:list(p.sizes,50).map(v=>{const s=obj(v);return {id:id(s.id),size:str(s.size,50),quantity:str(s.quantity,12)}}),spots:list(p.spots,20).map(v=>{const s=obj(v);let asset:Asset|null=null;if(s.asset!==null){const a=obj(s.asset);asset={id:id(a.id),name:str(a.name,300),type:enumStr(a.type,['image/png','image/jpeg','image/webp']),width:Number(a.width),height:Number(a.height)};if(!Number.isFinite(asset.width)||!Number.isFinite(asset.height)||asset.width<=0||asset.height<=0)fail()}return {id:id(s.id),location:enumStr(s.location,['左胸','右胸','背中','左袖','右袖','正面','その他']),other:str(s.other,300),width:str(s.width,20),height:str(s.height,20),lock:bool(s.lock),threadMode:enumStr(s.threadMode,['業者に相談','指定する']),thread:str(s.thread,1000),pattern:enumStr(s.pattern,['あり','なし','不明']),reference:str(s.reference,500),notes:str(s.notes),asset}})}})};
 if(!Number.isInteger(q.step)||q.step<1||q.step>5||!Number.isFinite(Date.parse(q.updatedAt))||(q.delivery&&!validDate(q.delivery)))fail();
 const ids=[...q.products.flatMap(p=>[p.id,...p.sizes.map(s=>s.id),...p.spots.map(s=>s.id)])];if(new Set(ids).size!==ids.length)fail();return q;
}
