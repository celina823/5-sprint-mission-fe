import Image from "next/image";

export default function Home() {
  return (
    <>
      <div>이것은 인덱스페이지</div>
      <div>테스트 가나다라마바사</div>
      <div>테스트 가나다라마바사</div>
      <div>테스트 가나다라마바사</div>
    </>
  )
}

// ✅ pages/ 폴더 (Page Router)
// 기존 Next.js 방식 (기본적으로 pages 폴더를 사용)
// pages/index.tsx → / (홈 페이지)
// pages/about.tsx → /about
// Dynamic Route: pages/blog/[id].tsx → /blog/123
// getServerSideProps / getStaticProps 지원 (서버에서 데이터 불러오기)
// _app.tsx, _document.tsx 파일을 통해 글로벌 레이아웃 설정
// 👉 Page Router 실습을 원한다면 pages/ 폴더를 직접 생성해서 사용해야 합니다.
