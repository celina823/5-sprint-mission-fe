import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetchUserData } from "@/services/user";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<{ image: string; nickname: string } | null>(null);

  // ✅ 로그인된 경우 유저 정보 가져오기
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetchUserData(token)
        .then((data) => {
          if (data) {
            setUser({
              image: data.image || "/assets/ic_profile.png",
              nickname: data.nickname,
            });
          } else {
            console.error("User data not found");
          }
        })
        .catch((error) => {
          console.error("API Error:", error);
          setUser(null); // Clear the user if fetching data fails
        });
    } else {
      console.error("토큰이 없습니다.");
      setUser(null); // Clear the user state if token is not found
    }
  }, []);

  // ✅ 로그아웃 기능
  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");

    // Clear the user state
    setUser(null);

    // Optionally reset any other relevant states, such as likes, cart, etc.

    // Redirect user to signin page
    router.push("/signin");
  };

  // 현재 경로에 맞춰 클래스를 변경
  const isActive = (path: string) => router.pathname === path ? "text-primary-100" : "text-gray-600";

  return (
    <header className="fixed top-0 left-0 right-0 flex items-center justify-between bg-white shadow-md px-6 py-4 z-10 h-[70px]">
      {/* 로고 클릭 시 홈으로 이동 */}
      <div className="flex items-center space-x-[32px]">
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/Group 19.png"
            alt="MyLogo"
            width={153}
            height={51}
          />
        </Link>

        {/* 네비게이션 메뉴 */}
        <nav className="flex space-x-[32px]">
          <Link
            href="/freeboard"
            className={`text-lg ${isActive("/freeboard")} hover:text-primary-100 font-bold text-[18px] leading-[21.48px] flex items-center justify-center whitespace-nowrap`}
          >
            자유게시판
          </Link>
          <Link
            href="/items"
            className={`text-lg ${isActive("/items")} hover:text-primary-100 font-bold text-[18px] leading-[21.48px] flex items-center justify-center whitespace-nowrap`}
          >
            중고마켓
          </Link>
        </nav>
      </div>

      {/* 로그인 버튼 */}
      {user ? (
        <div className="flex items-center space-x-4">
          <Image src={user.image} alt="Profile" width={40} height={40} className="rounded-full" />
          <span className="text-gray-800 font-bold">{user.nickname}</span>
          <button
            onClick={handleLogout}
            className="bg-primary-100 text-white h-[42px] px-[16px] py-[10px] rounded-[8px] flex items-center justify-center whitespace-nowrap"
          >
            로그아웃
          </button>
        </div>
      ) : (
        <Link href="/signin">
          <button className="bg-primary-100 text-white h-[42px] px-[23px] py-[12px] rounded-[8px] flex items-center justify-center whitespace-nowrap">
            로그인
          </button>
        </Link>
      )}
    </header>
  );
}
