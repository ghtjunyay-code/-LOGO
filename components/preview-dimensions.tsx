export default function PreviewDimensions({x=0,y=0,width,height,rotation=0,color,company=false}:{x?:number;y?:number;width:number;height:number;rotation?:number;color:string;company?:boolean}){
 const side=company?1:-1,dy=side*(height/2+7),dx=side*(width/2+7),fmt=(v:number)=>Number(v.toFixed(1));
 return <g transform={`translate(${x} ${y}) rotate(${rotation})`} fill={color} stroke={color} strokeWidth=".35" fontSize="3.5" fontFamily="sans-serif">
 <path fill="none" d={`M ${-width/2} ${dy-2} v 4 M ${-width/2} ${dy} H ${width/2} M ${width/2} ${dy-2} v 4 M ${dx-2} ${-height/2} h 4 M ${dx} ${-height/2} V ${height/2} M ${dx-2} ${height/2} h 4`}/>
 <text stroke="none" textAnchor="middle" x="0" y={dy+(company?5:-2)}>{company?'会社名 横 約':'ロゴ 横 '}{fmt(width)} mm</text>
 <text stroke="none" textAnchor="middle" transform={`translate(${dx+(company?5:-3)} 0) rotate(-90)`}>{company?'文字高さ ':'ロゴ 縦 '}{fmt(height)} mm</text>
 </g>;
}
