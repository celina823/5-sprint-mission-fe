import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!email) {
      setError("이메일을 입력해주세요.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("잘못된 이메일 형식입니다.");
      return;
    }
    if (password.length < 8) {
      setError("비밀번호를 8자 이상 입력해주세요.");
      return;
    }
    setError("");
    alert("로그인 성공!");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen px-4">
      <header className="mb-10">
        <Link href="/">
          <Image src="/assets/logo.png" alt="Panda Market Logo" width={396} height={132} />
        </Link>
      </header>
      <main className="w-full max-w-md">

        <div className="mb-4">
          <label htmlFor="email" className="block font-bold text-gray_800">이메일</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-14 px-4 mt-2 rounded-lg bg-gray-100 focus:outline-blue-500"
            placeholder="이메일을 입력해주세요"
          />
          {error && error.includes("이메일") && (
            <div className="text-red-500 text-sm mt-2">{error}</div>
          )}
        </div>
        <div className="mb-4 relative">
          <label htmlFor="password" className="block font-bold text-gray_800">비밀번호</label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-14 px-4 mt-2 rounded-lg bg-gray-100 focus:outline-blue-500"
            placeholder="비밀번호를 입력해주세요"
          />
          {error && error.includes("비밀번호") && (
            <div className="text-red-500 text-sm mt-2">{error}</div>
          )}
          <span
            className="absolute top-12 right-4 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            <Image
              src={showPassword ? "/assets/btn_visibility_on_24px.png" : "/assets/btn_visibility_off_24px.png"}
              alt="비밀번호 표시 아이콘"
              width={24}
              height={24}
            />
          </span>
        </div>
        <button
          onClick={handleLogin}
          className="w-full h-14 mt-4 rounded-full bg-gray-400 text-gray-100 font-semibold text-lg hover:bg-primary-100"
        >
          로그인
        </button>
        <div className="flex justify-between items-center mt-6 rounded-[8px] text-center h-[74px] px-[23px] bg-[#E6F2FF]">
          <p className="text-gray_800">간편 로그인하기</p>
          <div className="flex justify-center items-center gap-4">
            <Link href="https://www.google.com/" target="_blank">
              <Image src="/assets/Component 2@3x.png" alt="Google Login" width={42} height={42} />
            </Link>
            <Link href="https://www.kakaocorp.com/page/" target="_blank">
              <Image src="/assets/Component 3@3x.png" alt="Kakao Login" width={42} height={42} />
            </Link>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-gray_800">
            판다마켓이 처음이신가요? <Link href="/signup" className="text-primary-100">회원가입</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
