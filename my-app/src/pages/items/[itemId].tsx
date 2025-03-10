import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { productsDetail, productFavorite, productFavoriteNone } from "@/services/products";
import Image from "next/image";

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

const ItemDetail = () => {

  const router = useRouter();
  const { itemId } = router.query; // Get itemId from the URL
  const [product, setProduct] = useState<Product | null>(null); // State to store product data
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    if (!itemId) return; // Wait for itemId to be available
    console.log(localStorage.getItem("authToken"));
    const fetchProduct = async () => {
      try {
        const data = await productsDetail(itemId as string); // Fetch product data using productsDetail
        setProduct(data); // Set product data
      } catch (error) {
        console.log(error);
        setError("상품 정보를 불러오는 데 실패했습니다."); // Set error message
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };

    fetchProduct();
  }, [itemId]);

  const handleFavorite = async () => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("authToken");

    console.log("현재 토큰:", token);

    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!product) return;

    const updatedIsFavorite = !product.isFavorite;
    const updatedFavoriteCount = updatedIsFavorite
      ? product.favoriteCount + 1
      : product.favoriteCount - 1;

    // Optimistically update UI
    setProduct({ ...product, isFavorite: updatedIsFavorite, favoriteCount: updatedFavoriteCount });

    try {
      if (updatedIsFavorite) {
        await productFavorite(product.id.toString()); // Call POST API if liking
      } else {
        await productFavoriteNone(product.id.toString()); // Call DELETE API if unliking
      }
    } catch (error) {
      console.log(error);
      setError("좋아요 기능을 처리하는 데 실패했습니다.");
      // Rollback UI state on failure
      setProduct({ ...product, isFavorite: product.isFavorite, favoriteCount: product.favoriteCount });
    }
  };

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const storedToken = localStorage.getItem("authToken");
  //     console.log("Token on useEffect:", storedToken);
  //     setToken(storedToken);
  //   }
  // }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>상품을 찾을 수 없습니다.</div>;
  return (
    <div>
      <h1>{product.name}</h1>
      <div>
        <strong>가격: </strong>{product.price.toLocaleString()} 원
      </div>
      <div>
        <strong>작성일: </strong>{new Date(product.createdAt).toLocaleDateString()}
      </div>
      <div>
        <strong>작성자: </strong>{product.ownerNickname}
      </div>
      <div>
        <strong>즐겨찾기 수: </strong>{product.favoriteCount}
      </div>

      <div>
        <strong>설명: </strong>
        <p>{product.description}</p>
      </div>

      <div>
        <strong>태그: </strong>
        <ul>
          {product.tags.map((tag, index) => (
            <li key={index}>{tag}</li>
          ))}
        </ul>
      </div>

      <div>
        <strong>이미지:</strong>
        <div className="image-gallery">
          {product.images.map((image, index) => (
            <Image
              key={index}
              src={image}
              alt={product.name}
              width={300}
              height={200}
              layout="intrinsic" // ✅ 최적화된 이미지 로딩 방식 적용
            />
          ))}
        </div>
      </div>
      <div>
        <strong>즐겨찾기 수: </strong>{product.favoriteCount}
      </div>
      <button onClick={handleFavorite}>
        {product.isFavorite ? "좋아요 취소" : "좋아요"}
      </button>
    </div>
  );
};

export default ItemDetail;
