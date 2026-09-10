import {env} from 'cloudflare:workers';
export function db(){if(!env.DB)throw new Error('保存先に接続できません');return env.DB}
export function bucket(){const b=(env as unknown as {FILES:R2Bucket}).FILES;if(!b)throw new Error('原稿の保存先に接続できません');return b}
export function owner(req:Request){const user=req.headers.get('oai-authenticated-user-id');if(user)return user;if(process.env.NODE_ENV==='development'&&['localhost','127.0.0.1'].includes(new URL(req.url).hostname))return 'local-test-user';throw new Response('サインインが必要です',{status:401})}
export function writeAccess(req:Request){const user=owner(req);const origin=req.headers.get('origin');if(!origin||origin!==new URL(req.url).origin)throw new Response('同じサイトから操作してください',{status:403});return user}
export function json(value:unknown,status=200){return Response.json(value,{status,headers:{'Cache-Control':'no-store'}})}
export function failure(e:unknown){if(e instanceof Response)return e;console.error('Embroidery storage operation failed',e instanceof Error?e.message:'unknown');return json({error:'保存先に接続できませんでした。入力を残したまま再試行してください。'},503)}
export async function boundedBody(req:Request,limit:number){const reader=req.body?.getReader();if(!reader)return new Uint8Array();const chunks:Uint8Array[]=[];let size=0;while(true){const r=await reader.read();if(r.done)break;size+=r.value.length;if(size>limit){await reader.cancel();throw new Response('ファイルまたはデータが大きすぎます',{status:413})}chunks.push(r.value)}const out=new Uint8Array(size);let pos=0;for(const b of chunks){out.set(b,pos);pos+=b.length}return out}
