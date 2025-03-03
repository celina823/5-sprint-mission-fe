import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router"; // useRouter 훅 사용

export default function Header() {
  const router = useRouter(); // useRouter 훅 사용

  // 현재 경로에 맞춰 클래스를 변경
  const isActive = (path: string) => router.pathname === path ? "text-Primary_100" : "text-gray_600";

  return (
    <header className="fixed top-0 left-0 right-0 flex items-center justify-between bg-white shadow-md px-6 py-4 z-10 h-[70px]">
      {/* 로고 클릭 시 홈으로 이동 */}
      <div className="flex items-center space-x-[32px]">
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/Group 19.png" // public 폴더 내의 이미지 경로
            alt="MyLogo"
            width={153} // 로고 크기
            height={51} // 로고 크기
          />
        </Link>

        {/* 네비게이션 메뉴 */}
        <nav className="flex space-x-[32px]">
          <Link
            href="/freeboard"
            className={`text-lg ${isActive("/freeboard")} hover:text-Primary_100 font-bold text-[18px] leading-[21.48px] flex items-center justify-center whitespace-nowrap`}
          >
            자유게시판
          </Link>
          <Link
            href="/market"
            className={`text-lg ${isActive("/market")} hover:text-Primary_100 font-bold text-[18px] leading-[21.48px] flex items-center justify-center whitespace-nowrap`}
          >
            중고마켓
          </Link>
        </nav>
      </div>
      {/* 로그인 버튼 */}
      <button className="bg-Primary_100 text-white h-[42px] px-[23px] py-[12px] rounded-[8px] flex items-center justify-center whitespace-nowrap">
        로그인
      </button>
    </header>
  );
}
