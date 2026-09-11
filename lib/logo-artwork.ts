export function isolateArtwork(input:Uint8ClampedArray,width:number,height:number){
 const data=new Uint8ClampedArray(input),count=width*height;
 if(data.length!==count*4||!width||!height)throw new Error('画像のサイズを確認してください');
 const border:number[]=[];
 for(let x=0;x<width;x++){border.push(x,(height-1)*width+x)}
 for(let y=1;y<height-1;y++){border.push(y*width,y*width+width-1)}
 const opaque=border.filter(p=>data[p*4+3]>=250);
 const median=(a:number[])=>a.sort((a,b)=>a-b)[Math.floor(a.length/2)];
 const bg=[0,1,2].map(k=>median(opaque.map(p=>data[p*4+k]))||0);
 const near=(p:number)=>data[p*4+3]<16||[0,1,2].every(k=>Math.abs(data[p*4+k]-bg[k])<=22);
 // Only a nearly uniform opaque outer border qualifies as a background.
 // Transparent artwork is already cut out; don't delete white logo details.
 const remove=opaque.length>=border.length*.98&&border.filter(near).length>=border.length*.95;
 if(remove){const seen=new Uint8Array(count),queue=new Int32Array(count);let head=0,tail=0;
 const add=(p:number)=>{if(!seen[p]&&near(p)){seen[p]=1;queue[tail++]=p}};
 border.forEach(add);
 while(head<tail){const p=queue[head++];data[p*4+3]=0;const x=p%width,y=Math.floor(p/width);if(x)add(p-1);if(x+1<width)add(p+1);if(y)add(p-width);if(y+1<height)add(p+width)}
 }
 let left=width,top=height,right=-1,bottom=-1;
 for(let p=0;p<count;p++)if(data[p*4+3]>=16){const x=p%width,y=Math.floor(p/width);left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y)}
 // An all-background image must never silently become an empty logo.
 if(right<left)return {data:new Uint8ClampedArray(input),x:0,y:0,width,height};
 return {data,x:left,y:top,width:right-left+1,height:bottom-top+1};
}

export async function artworkPng(blob:Blob){
 const url=URL.createObjectURL(blob);
 try{const img=await new Promise<HTMLImageElement>((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(new Error('ロゴ画像を読み込めませんでした'));i.src=url});
 const scale=Math.min(1,1600/Math.max(img.naturalWidth,img.naturalHeight));const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.naturalWidth*scale));canvas.height=Math.max(1,Math.round(img.naturalHeight*scale));const ctx=canvas.getContext('2d',{willReadFrequently:true});if(!ctx)throw new Error('ロゴの背景処理を開始できませんでした');ctx.drawImage(img,0,0,canvas.width,canvas.height);
 const artwork=isolateArtwork(ctx.getImageData(0,0,canvas.width,canvas.height).data,canvas.width,canvas.height);ctx.putImageData(new ImageData(artwork.data,canvas.width,canvas.height),0,0);
 const cropped=document.createElement('canvas');cropped.width=artwork.width;cropped.height=artwork.height;cropped.getContext('2d')!.drawImage(canvas,artwork.x,artwork.y,artwork.width,artwork.height,0,0,artwork.width,artwork.height);
 const png=await new Promise<Blob>((resolve,reject)=>cropped.toBlob(b=>b?resolve(b):reject(new Error('ロゴの背景処理に失敗しました')),'image/png'));
 return {blob:png,width:artwork.width,height:artwork.height};
 }finally{URL.revokeObjectURL(url)}
}
