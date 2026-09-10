import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata={title:'ロゴ刺繍｜見積もり依頼',description:'商品とロゴの情報をまとめるロゴ刺繍の見積もり依頼フォーム。',robots:{index:false,follow:false},icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ja"><body>{children}</body></html>}

