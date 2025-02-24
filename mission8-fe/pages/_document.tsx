import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        {/* Pretendard CDN 추가 */}
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </Head>
      {/* Tailwind의 font-pretendard 클래스를 추가 */}
      <body >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
