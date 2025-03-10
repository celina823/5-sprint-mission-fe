import React, { useState, useEffect } from "react";
import { products } from "@/services/products"
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  images: string;
}

const Items = () => {
  const [productList, setProductList] = useState<Product[]>([]); // 상품 목록 상태
  const [loading, setLoading] = useState<boolean>(true);  // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 오류 상태

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await products();  // 상품 목록 가져오기
        setProductList(data.list);      // 상품 목록 설정
      } catch {
        setError("상품 목록을 불러오는 데 실패했습니다."); // 오류 처리
      } finally {
        setLoading(false);  // 로딩 완료
      }
    };

    fetchProducts();
  }, []);

  // 이미지 깨지는거 처리
  const getImageUrl = (image: string | null | undefined) => {
    if (!image || image.trim() === "" || image.startsWith("https://example.com")) {
      return "/assets/img_default.png"; // 기본 이미지 경로
    }
    return image; // 유효한 이미지 URL인 경우 원본 이미지 사용
  };

  if (loading) return <div>Loading...</div>;  // 로딩 중 표시
  if (error) return <div>{error}</div>;      // 오류 메시지 표시

  return (
    <div>
      <h1>상품 목록</h1>
      <div className="product-list">
        {productList.map((product) => (
          <div key={product.id} className="product-item">
            <Image
              src={getImageUrl(product.images[0])}  // 첫 번째 이미지 사용
              alt={product.name}
              width={220}
              height={220}
            />
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>가격: {product.price.toLocaleString()} 원</p>
            <button onClick={() => console.log(`Go to product ${product.id}`)}>
              상세보기
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Items;
