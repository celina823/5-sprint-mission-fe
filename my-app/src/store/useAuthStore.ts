import { create } from "zustand";
import { apiClient } from "@/services/api";

interface User {
  image: string;
  nickname: string;
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  login: (token: string, refreshToken: string, user: User) => void;
  logout: () => void;
  refreshAccessToken: () => Promise<string | null>;
  setUser: (user: User) => void;
}

// ✅ Zustand 스토어 생성
export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== "undefined" ? localStorage.getItem("authToken") : null,
  refreshToken: typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null,
  user: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null,

  // ✅ 로그인 시 토큰과 유저 정보 저장
  login: (token, refreshToken, user) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));
    set({ token, refreshToken, user });
  },

  // ✅ 로그아웃 시 상태 초기화
  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    set({ token: null, refreshToken: null, user: null });
  },

  // ✅ 토큰 갱신 함수
  refreshAccessToken: async () => {
    try {
      const storedRefreshToken = localStorage.getItem("refreshToken");
      if (!storedRefreshToken) return null;

      const response = await apiClient("/auth/refresh-token", {
        method: "POST",
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
      });

      if (response?.accessToken) {
        localStorage.setItem("authToken", response.accessToken);
        set({ token: response.accessToken });
        return response.accessToken;
      }
    } catch (error) {
      console.error("🚨 토큰 갱신 실패.");
    }
    return null; // ✅ 로그아웃 실행하지 않고 null 반환
  },
  // ✅ `setUser` 액션 추가
  setUser: (user: User) => set({ user }),
}));
