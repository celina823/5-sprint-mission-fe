import React, { useState, useEffect } from "react";
import { products } from "@/services/products"
import Image from "next/image";
import { useRouter } from "next/router";
import { ProductPagination } from "@/global/components/productPagination";
import { getImageUrl } from "@/global/components/GetImageUrl";
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
  // 페이지네이션 및 검색어 구현 시 필요
  const [page, setPage] = useState<number>(1); // 현재 페이지
  const [pageSize] = useState<number>(10); // 페이지당 항목 수 (고정)
  const [keyword, setKeyword] = useState<string>(""); // 검색어
  const [totalPages, setTotalPages] = useState<number>(1); // 전체 페이지 수

  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await products({ page, pageSize, keyword });  // 상품 목록 가져오기
        setProductList(data.list || []); // 상품 목록 설정 (데이터가 없으면 빈 배열)
        setTotalPages(Math.ceil((data.totalCount || 1) / pageSize)); // totalPages 계산
      } catch {
        setError("상품 목록을 불러오는 데 실패했습니다."); // 오류 처리
      } finally {
        setLoading(false);  // 로딩 완료
      }
    };

    fetchProducts();
  }, [page, pageSize, keyword]); // 페이지, 검색어 변경 시 API 호출

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setPage(1); // 검색 시 첫 페이지로 이동
  };

  const handleViewDetail = (id: number) => {
    router.push(`/items/${id}`);
  };

  if (loading) return <div>Loading...</div>;  // 로딩 중 표시
  if (error) return <div>{error}</div>;      // 오류 메시지 표시
  console.log("데이터확인용", productList)
  return (
    <div>
      <h1>상품 목록</h1>
      {/* 검색 폼 */}
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="상품 검색"
        />
        <button type="submit">검색</button>
      </form>
      {/* 상품 리스트 */}
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
            <button onClick={() => handleViewDetail(product.id)}>
              상세보기
            </button>
          </div>
        ))}
      </div>
      {/* 페이지네이션 적용 */}
      <ProductPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default Items;
