import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from '@/store/useAuthStore';

const API_BASE_URL = "https://panda-market-api.vercel.app";

interface ApiOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown;
}


// JWT 토큰 디코딩 결과 타입
interface DecodedToken {
  exp: number; // 토큰 만료 시간
}

// apiClient 함수 수정
export const apiClient = async (endpoint: string, options: ApiOptions = {}) => {
  try {
    // 로컬 스토리지에서 인증 토큰 가져오기
    let token = localStorage.getItem("authToken");
    // ✅ 로그인 & 회원가입 요청은 토큰 없이 요청 가능
    const isAuthRequest = endpoint.includes("/auth/signIn") || endpoint.includes("/auth/signUp");
    // 기본 헤더 설정
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...options.headers,  // 기존 헤더가 있을 경우 이를 유지
    };

    // 인증 토큰이 있을 경우, 만료 체크 후 갱신
    if (token && !isAuthRequest) {
      // JWT 토큰 디코딩하여 만료 여부 확인
      const decoded: DecodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000); // 현재 시간 (초 단위)

      // 토큰 만료 시간 체크
      if (decoded.exp < currentTime) {
        console.warn("🔄 토큰이 만료되었습니다. 새 토큰을 갱신합니다...");

        // refresh token을 통해 새로운 access token을 얻음
        token = await useAuthStore.getState().refreshAccessToken();

        if (!token) {
          console.error("토큰 갱신 실패. 로그아웃 처리 필요");
          useAuthStore.getState().logout(); // 토큰 갱신 실패 시 로그아웃 처리
          return null;
        }

        // 갱신된 토큰을 로컬 스토리지에 저장
        localStorage.setItem("authToken", token);
      }

      // 갱신된 토큰을 Authorization 헤더에 추가
      headers["Authorization"] = `Bearer ${token}`;
    }
    // Axios 요청
    const response = await axios({
      url: `${API_BASE_URL}${endpoint}`,
      method: options.method || 'GET',
      headers: headers,
      data: options.body,
    });
    console.log("API 응답:", response.data); // ✅ 응답 데이터 출력
    return response.data;  // 응답 데이터 반환
  } catch (error) {
    // 오류 처리
    if (axios.isAxiosError(error)) {
      console.error("API 요청 실패:", error.response?.data || error.message);
    } else {
      console.error("Unknown Error:", error);
    }
    throw error; // 오류를 다시 던져서 호출하는 곳에서 처리할 수 있게 함
  }
};
