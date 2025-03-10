import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { signup } from '../services/auth';
import { SignModal } from "@/global/components/signModal";

const Signup = () => {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordCheckVisible, setPasswordCheckVisible] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '', passwordConfirmation: '' });
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

  const mutation = useMutation({
    mutationFn: () => signup(email, nickname, password, passwordConfirmation),
    onSuccess: () => {
      alert("회원가입 성공!");
      router.push("/signin");
    },
    onError: (error: unknown) => {
      console.error(error);
      if (error instanceof Error) {
        setModalMessage("사용중인 이메일입니다.");
      }
      setShowModal(true);
    },
  });

  const validateInputs = () => {
    const newErrors = { email: '', password: '', passwordConfirmation: '' };
    let isValid = true;

    if (!email.trim()) {
      newErrors.email = "이메일을 입력해주세요.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "잘못된 이메일 형식입니다.";
      isValid = false;
    }

    if (password.length < 8) {
      newErrors.password = "비밀번호는 8자 이상이어야 합니다.";
      isValid = false;
    }

    if (password !== passwordConfirmation) {
      newErrors.passwordConfirmation = "비밀번호가 일치하지 않습니다.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignup = () => {
    if (validateInputs()) {
      mutation.mutate();
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div id="all-wrapeer" className="flex flex-col justify-center items-center h-screen">
      {showModal && <SignModal message={modalMessage} onClose={closeModal} />}
      <header className="mt-20 flex justify-center w-full">
        <Link href="/">
          <Image src="/assets/logo.png" alt="Panda Market Logo" width={396} height={132} />
        </Link>
      </header>
      <main className="w-full max-w-md">
        {/* 이메일 입력란 */}
        <div className="email_area mt-10">
          <label htmlFor="uid" className="text-lg font-semibold mb-4">이메일</label>
          <input
            type="text"
            id="uid"
            name="uid"
            maxLength={50}
            tabIndex={1}
            placeholder="이메일을 입력해주세요"
            className="w-full h-14 bg-gray-100 border-none rounded-lg pl-4 focus:outline-primary-100"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        {/* 닉네임 입력란 */}
        <div className="nick_area mt-6">
          <label htmlFor="nickname" className="text-lg font-semibold mb-4">닉네임</label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            maxLength={15}
            tabIndex={2}
            placeholder="닉네임을 입력해주세요"
            className="w-full h-14 bg-gray-100 border-none rounded-lg pl-4 focus:outline-primary-100"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
        {/* 비밀번호 입력란 */}
        <div className="pass_area mt-6">
          <label htmlFor="password" className="text-lg font-semibold mb-4">비밀번호</label>
          <div className="pass_box relative">
            <input
              type={passwordVisible ? "text" : "password"}
              id="password"
              name="password"
              maxLength={15}
              tabIndex={3}
              placeholder="비밀번호를 입력해주세요"
              className="w-full h-14 bg-gray-100 border-none rounded-lg pl-4 focus:outline-primary-100"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              <Image
                src={passwordVisible ? "/assets/btn_visibility_on_24px.png" : "/assets/btn_visibility_off_24px.png"}
                alt="비밀번호 표시 아이콘"
                width={24}
                height={24}
              />
            </span>
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>
        {/* 비밀번호 확인 입력란 */}
        <div className="passcheck_area mt-6">
          <label htmlFor="passwordcheck" className="text-lg font-semibold mb-4">비밀번호 확인</label>
          <div className="passcheck_box relative">
            <input
              type={passwordCheckVisible ? "text" : "password"}
              id="passwordcheck"
              name="passwordcheck"
              maxLength={15}
              tabIndex={4}
              placeholder="비밀번호를 다시 한 번 입력해주세요"
              className="w-full h-14 bg-gray-100 border-none rounded-lg pl-4 focus:outline-primary-100"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
            <span
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setPasswordCheckVisible(!passwordCheckVisible)}
            >
              <Image
                src={passwordCheckVisible ? "/assets/btn_visibility_on_24px.png" : "/assets/btn_visibility_off_24px.png"}
                alt="비밀번호 표시 아이콘"
                width={24}
                height={24}
              />
            </span>
          </div>
          {errors.passwordConfirmation && <p className="text-red-500 text-sm mt-1">{errors.passwordConfirmation}</p>}
        </div>
        {/* 회원가입 버튼 */}
        <div className="join_area mt-6">
          <button
            onClick={handleSignup}
            disabled={!email || !nickname || !password || !passwordConfirmation || mutation.isPending}
            className={`w-full h-14 font-semibold rounded-lg transition ${!email || !nickname || !password || !passwordConfirmation || mutation.isPending
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary-100"
              }`}>
            회원가입
          </button>
        </div>
        {/* 간편로그인 */}
        <div className="간편_area mt-6 bg-blue-100 p-4 rounded-lg">
          <div className="간편-contentbox flex justify-between items-center text-lg">
            <p>간편 로그인하기</p>
            <div className="sns-icon flex gap-4">
              <a href="https://www.google.com/" target="_blank" className="간편-google">
                <Image className="googleim w-10" src="/assets/Component 2@3x.png" alt="google" width={42} height={42} />
              </a>
              <a href="https://www.kakaocorp.com/page/" target="_blank" className="간편-kakao">
                <Image className="kakaoim w-10" src="/assets/Component 3@3x.png" alt="kakao" width={42} height={42} />
              </a>
            </div>
          </div>
        </div>

        <div className="relogin_area mt-6 text-center text-sm">
          이미 회원이신가요? <Link href="/signin" className="text-primary-100">로그인</Link>
        </div>
      </main>
    </div>
  );
};

export default Signup;
