import { apiClient } from "./api";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number; // Expiration time (Unix timestamp)
}

const refreshToken = async () => {
  try {
    const response = await apiClient("/auth/refresh-token", { method: "POST" });
    if (response && response.token) {
      localStorage.setItem("token", response.token);
      return response.token;
    }
  } catch (error) {
    console.error("토큰 갱신 실패:", error);
  }
  return null;
};

export const fetchUserData = async (token: string | null) => {
  if (!token) {
    console.error("Token is missing");
    return null;
  }

  try {
    const decoded: DecodedToken = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);

    if (decoded.exp < currentTime) {
      console.warn("Token expired, attempting refresh...");
      token = await refreshToken();
      if (!token) {
        console.error("Failed to refresh token");
        localStorage.removeItem("token");
        return null;
      }
    }

    return await apiClient("/users/me", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });
  } catch (error) {
    console.error("유저 정보 불러오기 오류:", error);
    return null;
  }
};
