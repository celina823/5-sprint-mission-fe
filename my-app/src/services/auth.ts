import { apiClient } from "./api";

// 로그인페이지 API요청함수
export const login = async (email: string, password: string) => {
  try {
    const response = await apiClient("/auth/signIn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response?.accessToken) {
      localStorage.setItem("authToken", response.accessToken); // 🔹 토큰 저장
      console.log("로그인 성공! 토큰 저장:", response.accessToken);
    } else {
      console.error("로그인 응답에 accessToken이 없음:", response);
    }

    return response;
  } catch (error) {
    console.error("로그인 실패:", error);
    throw error;
  }
};

// 회원가입페이지 API요청함수
export const signup = async (email: string, nickname: string, password: string, confirmPassword: string) => {
  try {
    const response = await apiClient("/auth/signUp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        nickname,
        password,
        passwordConfirmation: confirmPassword
      }),
    });

    if (response?.accessToken) {
      localStorage.setItem("authToken", response.accessToken);
      console.log("회원가입 성공! 토큰 저장:", response.accessToken);
    } else {
      console.error("회원가입 응답에 accessToken이 없음:", response);
    }

    return response;
  } catch (error) {
    console.error("회원가입 실패:", error);
    throw error;
  }
};