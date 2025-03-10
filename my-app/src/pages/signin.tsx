import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { login } from "../services/auth";
import { SignModal } from "@/global/components/signModal";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");

  const router = useRouter();

  // ✅ 로그인 상태 체크 (로그인 되어 있으면 /items로 이동)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/items"); // replace를 사용하여 뒤로가기 시 로그인 페이지가 나오지 않도록 처리
    }
  }, [router]);

  const isDisabled = !(email.trim() && password.trim()); // 이메일, 비밀번호 둘 다 입력시 활성화

  // 로그인 API 요청을 위한 useMutation 설정
  const mutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => login(email, password),
    onSuccess: (data) => {
      localStorage.setItem("token", data.accessToken);
      alert("로그인 성공!");
      router.push("/items");
    },
    onError: (error: unknown) => {
      console.error(error);
      if (error instanceof Error) {
        setModalMessage("비밀번호가 일치하지 않습니다.");
      }
      setShowModal(true);
    },
  });

  const handleLogin = () => {
    setError(""); // 기존 오류 메시지 초기화

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("잘못된 이메일 형식입니다.");
      return;
    }
    if (password.length < 8) {
      setError("비밀번호를 8자 이상 입력해주세요.");
      return;
    }
    console.log("로그인 계정 확인:", { email, password });
    mutation.mutate({ email, password }); // 로그인 요청 실행
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isDisabled && !mutation.isPending) {
      handleLogin();
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen px-4">
      {showModal && <SignModal message={modalMessage} onClose={closeModal} />}

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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-14 px-4 mt-2 rounded-lg bg-gray-100 focus:outline-primary-100"
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-14 px-4 mt-2 rounded-lg bg-gray-100 focus:outline-primary-100"
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
          disabled={isDisabled}
          className={`w-full h-[56px] px-[124px] py-[16px] text-gray-100 font-bold rounded-[40px] transition 
            ${isDisabled || mutation.isPending ? "bg-gray-400 cursor-not-allowed" : "bg-primary-100"}`}>
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
