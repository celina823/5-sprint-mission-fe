import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";

const Signup = () => {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');

  // Handle toggle password visibility
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePassword = () => setPasswordVisible(!passwordVisible);

  const [passwordCheckVisible, setPasswordCheckVisible] = useState(false);
  const togglePasswordCheck = () => setPasswordCheckVisible(!passwordCheckVisible);

  return (
    <div id="all-wrapeer" className="flex flex-col justify-center items-center h-screen">
      <header className="mt-20 flex justify-center w-full">
        <Link href="/">
          <Image src="/assets/logo.png" alt="Panda Market Logo" width={396} height={132} />
        </Link>
      </header>
      <main className="w-full max-w-md">
        <div className="overlay hidden fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50"></div>
        <div className="alert_box hidden fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-64 z-50 bg-white rounded-lg">
          <div className="alert-message absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            사용 중인 이메일입니다.
          </div>
          <button className="alrert-btn absolute top-[174px] left-[392px] w-30 h-12 bg-blue-500 text-white font-semibold rounded-lg">
            확인
          </button>
        </div>

        <div className="email_area mt-10">
          <label htmlFor="uid" className="text-lg font-semibold mb-4">이메일</label>
          <div className="id_box">
            <input
              type="text"
              id="uid"
              name="uid"
              maxLength={50}
              tabIndex={1}
              placeholder="이메일을 입력해주세요"
              className="w-full h-14 bg-gray-200 border-none rounded-lg pl-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="hide text-red-500">이메일을 입력해주세요.</div>
        </div>

        <div className="nick_area mt-6">
          <label htmlFor="unickname" className="text-lg font-semibold mb-4">닉네임</label>
          <div className="pass_box">
            <input
              type="text"
              id="unickname"
              name="nickname"
              maxLength={15}
              tabIndex={2}
              placeholder="닉네임을 입력해주세요"
              className="w-full h-14 bg-gray-200 border-none rounded-lg pl-4"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
        </div>

        <div className="pass_area mt-6">
          <label htmlFor="password" className="text-lg font-semibold mb-4">비밀번호</label>
          <div className="pass_box relative">
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              name="password"
              maxLength={15}
              tabIndex={3}
              placeholder="비밀번호를 입력해주세요"
              className="w-full h-14 bg-gray-200 border-none rounded-lg pl-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span onClick={togglePassword} className="absolute top-2 right-4 cursor-pointer">
              <Image src="/assets/btn_visibility_off_24px.png" alt="비밀번호 표시 아이콘" width={24} height={24} />
            </span>
          </div>
        </div>

        <div className="passcheck_area mt-6">
          <label htmlFor="passwordcheck" className="text-lg font-semibold mb-4">비밀번호 확인</label>
          <div className="passcheck_box relative">
            <input
              type={passwordCheckVisible ? 'text' : 'password'}
              id="passwordcheck"
              name="passwordcheck"
              maxLength={15}
              tabIndex={4}
              placeholder="비밀번호를 다시 한 번 입력해주세요"
              className="w-full h-14 bg-gray-200 border-none rounded-lg pl-4"
              value={passwordCheck}
              onChange={(e) => setPasswordCheck(e.target.value)}
            />
            <span onClick={togglePasswordCheck} className="absolute top-2 right-4 cursor-pointer">
              <Image src="/assets/btn_visibility_off_24px.png" alt="비밀번호 표시 아이콘" width={24} height={24} />
            </span>
          </div>
        </div>

        <div className="join_area mt-6">
          <button className="join-btn w-full h-14 bg-gray-400 text-white font-semibold rounded-lg">
            회원가입
          </button>
        </div>

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
          이미 회원이신가요? <a href="./login.html" className="signup-link text-error">로그인</a>
        </div>
      </main>
    </div>
  );
};

export default Signup;
