import { apiClient } from "./api";

// 로그인페이지 API요청함수
export const login = async (email: string, password: string) => {
  return apiClient("/auth/signIn", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

// 회원가입페이지 API요청함수
export const signup = async (email: string, nickname: string, password: string, passwordConfirmation: string) => {
  return apiClient("/auth/signUp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, nickname, password, passwordConfirmation }),
  });
};