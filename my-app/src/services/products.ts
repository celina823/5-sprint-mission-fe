import { apiClient } from "./api";

// 상품목록 요청 함수
export const products = async () => {
  try {
    const response = await apiClient(`/products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // 필요한 경우 인증 토큰 추가 (예: Authorization)
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw error;
  }
};

// 상품상세 요청 함수
export const productsDetail = async (productId: string) => {
  try {
    const response = await apiClient(`/products/${productId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // 필요한 경우 인증 토큰 추가 (예: Authorization)
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw error;
  }
};