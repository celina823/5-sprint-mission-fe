const API_BASE_URL = "https://panda-market-api.vercel.app";

export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error("API 요청 실패");
  }

  return response.json();
};
