// api.ts
import axios from 'axios';

const API_BASE_URL = "https://panda-market-api.vercel.app";

// apiClient 함수 수정
export const apiClient = async (endpoint: string, options: any = {}) => {
  try {
    // 로컬 스토리지에서 인증 토큰 가져오기
    const token = localStorage.getItem("authToken");

    // 기본 헤더 설정
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,  // 기존 헤더가 있을 경우 이를 유지
    };

    // 인증 토큰이 있을 경우 Authorization 헤더에 추가
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Axios 요청
    const response = await axios({
      url: `${API_BASE_URL}${endpoint}`,
      method: options.method || 'GET',
      headers: headers,
      data: options.body,
    });

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
