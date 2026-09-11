import {artworkPng} from './logo-artwork';
import {resizeSpot,parseQuote,type Quote,type Asset} from './quote';
export async function api<T=any>(path:string,init?:RequestInit):Promise<T>{const r=await fetch(path,init);if(!r.ok){let message='通信できませんでした。入力を残したまま再試行してください。';try{const v=await r.json() as {error?:string};message=v.error||message}catch{}throw new Error(message)}return r.json() as Promise<T>}
export const assetUrl=(a:Asset,download=false)=>`/api/files?id=${encodeURIComponent(a.id)}${download?'&download=1':''}`;
export function storeLocal(q:Quote){try{localStorage.setItem('embroidery-local-draft-v1',JSON.stringify(q));return true}catch{return false}}
export function readLocal():Quote|null{try{const v=localStorage.getItem('embroidery-local-draft-v1');return v?parseQuote(JSON.parse(v)):null}catch{return null}}
export function downloadData(q:Quote){const url=URL.createObjectURL(new Blob([JSON.stringify(q,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=`刺繍見積依頼_${q.id}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
export function originalStore(){return new Promise<IDBDatabase>((resolve,reject)=>{const r=indexedDB.open('embroidery-originals-v1',1);r.onupgradeneeded=()=>r.result.createObjectStore('files');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
export async function retainOriginal(key:string,file:File){const db=await originalStore();try{await new Promise<void>((resolve,reject)=>{const tx=db.transaction('files','readwrite');tx.objectStore('files').put(file,key);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error)})}finally{db.close()}}
export async function readOriginal(key:string){const db=await originalStore();try{return await new Promise<File|undefined>((resolve,reject)=>{const r=db.transaction('files').objectStore('files').get(key);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}finally{db.close()}}
export async function uploadOriginal(file:File):Promise<Asset>{if(file.size>10*1024*1024)throw new Error('この画面では10MB以下の画像を選んでください');if(!['image/png','image/jpeg','image/webp'].includes(file.type))throw new Error('PNG・JPEG・WebPの画像を選んでください');const url=URL.createObjectURL(file);try{const dimensions=await new Promise<{width:number;height:number}>((resolve,reject)=>{const img=new Image();img.onload=()=>resolve({width:img.naturalWidth,height:img.naturalHeight});img.onerror=()=>reject(new Error('画像を読み込めません。別のPNG・JPEG画像でお試しください'));img.src=url});const a=await api('/api/files',{method:'POST',headers:{'Content-Type':file.type,'x-file-name':encodeURIComponent(file.name)},body:file});return prepareAsset({...a,...dimensions},file)}finally{URL.revokeObjectURL(url)}}

const preparedAssets=new Map<string,Promise<Asset>>();
export function prepareAsset(asset:Asset,original?:Blob):Promise<Asset>{
 if(asset.preview)return Promise.resolve(asset);
 const cached=preparedAssets.get(asset.id);if(cached)return cached;
 const promise=(async()=>{let blob=original;if(!blob){const response=await fetch(assetUrl(asset));if(!response.ok)throw new Error('背景処理用のロゴ原稿を読み込めませんでした');blob=await response.blob()}
 const result=await artworkPng(blob);const preview=await api('/api/files',{method:'POST',headers:{'Content-Type':'image/png','x-file-name':encodeURIComponent('preview-'+asset.name+'.png')},body:result.blob});
 return {...asset,preview:{id:preview.id,width:result.width,height:result.height}};
 })();preparedAssets.set(asset.id,promise);promise.catch(()=>preparedAssets.delete(asset.id));return promise;
}
export async function prepareQuote(input:Quote):Promise<Quote>{const q=structuredClone(input);for(const p of q.products)for(const s of p.spots){if(!s.asset||s.asset.preview)continue;s.asset=await prepareAsset(s.asset);q.checked=false;const axis=s.axis||'width';if(Number(s[axis])>0){s.lock=true;Object.assign(s,resizeSpot(s,axis,s[axis]))}}return q}
