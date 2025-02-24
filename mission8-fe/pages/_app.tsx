import type { AppProps } from "next/app";
import Header from "@/global/header/Header";
// _app.tsx
import '../styles/global.css'; // global.css 파일 임포트


export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <div className="pt-[70px]"> {/* 헤더 높이만큼 여백 추가 */}
        <Component {...pageProps} />
      </div>
    </>
  )
}