import { apiClient } from "./api";

interface Writer {
  id: number;
  nickname: string;
  image: string;
}

interface Product {
  createdAt: string;
  favoriteCount: number;
  ownerNickname: string;
  ownerId: number;
  images: string[];
  tags: string[];
  price: number;
  description: string;
  name: string;
  id: number;
  isFavorite: boolean;
}

interface ProductComment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  writer: Writer;
}

interface ProductCommentResponse {
  list: ProductComment[];
  nextCursor: number | null;
}

// 상품목록 요청 함수
export const products = async ({
  page = 2,
  pageSize = 10,
  keyword = "",
}: {
  page?: number;
  pageSize?: number;
  keyword?: string;
}) => {
  try {
    // 기본 URL 생성
    let url = `/products?page=${page}&pageSize=${pageSize}`;

    // 검색어가 존재하면 keyword 파라미터 추가
    if (keyword.trim() !== "") {
      url += `&keyword=${encodeURIComponent(keyword)}`;
    }

    const response = await apiClient(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  } catch (error) {
    console.error("Error fetching products:", error);
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
    return response as Product;
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw error;
  }
};

//좋아요 기능
export const productFavorite = async (productId: string) => {
  try {
    const token = localStorage.getItem("authToken"); // Check token

    console.log("Sending Favorite Request with Token:", token);
    const response = await apiClient(`/products/${productId}/favorite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response as { success: boolean };
  } catch (error) {
    console.error("Error fetching favorite:", error);
    throw error;
  }
};

//좋아요 취소 기능
export const productFavoriteNone = async (productId: string) => {
  try {
    const response = await apiClient(`/products/${productId}/favorite`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response as { success: boolean };
  } catch (error) {
    console.error("Error fetching favorite:", error);
    throw error;
  }
};

//판매글 삭제 기능
export const productDelete = async (productId: number) => {
  try {
    const token = localStorage.getItem("authToken"); // 토큰 가져오기

    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    await apiClient(`/products/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

//댓글 조회 기능
export const productCommentsGet = async (
  productId: string
): Promise<ProductCommentResponse> => {
  try {
    const response = await apiClient(
      `/products/${productId}/comments?limit=10`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // 필요한 경우 인증 토큰 추가 (예: Authorization)
        },
      }
    );
    return response as ProductCommentResponse;
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw error;
  }
};

// 댓글 등록 기능
export const productCommentsPost = async (
  productId: string,
  content: string
) => {
  try {
    const token = localStorage.getItem("authToken"); // 토큰 가져오기

    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    const response = await apiClient(`/products/${productId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // 인증 토큰 추가
      },
      body: JSON.stringify({ content }),
    });
    console.log("댓글 등록 응답:", response); // ✅ 서버 응답을 확인
    return response;
  } catch (error) {
    console.error("Error posting comment:", error);
    throw error;
  }
};

// 댓글 수정 기능
export const productCommentsPatch = async (
  commentId: number,
  content: string
) => {
  try {
    const token = localStorage.getItem("authToken"); // 토큰 가져오기

    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    const response = await apiClient(`/comments/${commentId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });
    return response;
  } catch (error) {
    console.error("Error updating comment:", error);
    throw error;
  }
};

// 댓글 삭제 기능
export const productCommentsDelete = async (commentId: number) => {
  try {
    const token = localStorage.getItem("authToken"); // 토큰 가져오기

    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    await apiClient(`/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};
