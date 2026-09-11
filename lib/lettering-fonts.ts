export const allLetteringFonts=['活字体','ゴシック体','筆記体','楷書体','イタリック体','行書体'];
const rules:Record<string,string[]>={
 'アルファベット':['活字体','ゴシック体','筆記体','楷書体','イタリック体'],
 '漢字':['楷書体','行書体','ゴシック体'],
 'ひらがな':['楷書体','ゴシック体'],
 'カタカナ':['楷書体','ゴシック体'],
 '数字':allLetteringFonts,
 'その他の文字':['楷書体','ゴシック体'],
};
export const canonicalFont=(font:string)=>font==='ゴシック'?'ゴシック体':font;
export function characterKinds(text:string){const found=new Set<string>();for(const c of text.normalize('NFKC')){
 if(/[A-Za-z]/.test(c))found.add('アルファベット');
 else if(/[0-9]/.test(c))found.add('数字');
 else if(/[\p{Script=Han}々〆]/u.test(c))found.add('漢字');
 else if(/\p{Script=Hiragana}/u.test(c))found.add('ひらがな');
 else if(/\p{Script=Katakana}/u.test(c))found.add('カタカナ');
 else if(!/[\s\p{P}\p{S}\p{M}ー]/u.test(c))found.add('その他の文字');
 }return [...found];}
export function allowedLetteringFonts(text:string){const kinds=characterKinds(text);const base=rules[kinds.find(k=>k!=='数字')||'数字'];return base.filter(font=>kinds.every(kind=>rules[kind].includes(font)));}
export function fontFamily(font:string){switch(canonicalFont(font)){
 case 'ゴシック体':return "'Yu Gothic',sans-serif";
 case '行書体':return "'HG行書体','HGP行書体','Yu Mincho',serif";
 case '楷書体':return "'KaiTi','Kaiti SC','Yu Mincho',serif";
 case '筆記体':return "'Segoe Script','Brush Script MT',cursive";
 case 'イタリック体':case '活字体':return "'Times New Roman',serif";
 default:return 'serif';
}}
