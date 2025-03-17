import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  productsDetail,
  productFavorite,
  productFavoriteNone,
  productCommentsGet,
  productCommentsPost,
  productCommentsPatch,
  productCommentsDelete,
  productDelete,
} from "@/services/products";
import Image from "next/image";
import Link from "next/link";
import { EditCommentDropdown } from "@/global/components/EditCommentDropdown";
import { ProductDropdown } from "@/global/components/EditProductDropdown";
import { getImageUrl, getProfileImgUrl } from "@/global/components/GetImageUrl";

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
  list: ProductComment[]; // List of comments
  nextCursor: number | null;
}

const ItemDetail = () => {
  const router = useRouter();
  const { itemId } = router.query; // Get itemId from the URL
  const [product, setProduct] = useState<Product | null>(null); // State to store product data
  const [comments, setComments] = useState<ProductComment[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // 댓글 CRUD 시 사용
  const [newComment, setNewComment] = useState<string>(""); // 입력된 새 댓글
  const [editingComment, setEditingComment] = useState<{
    id: number;
    content: string;
  } | null>(null); // 수정 중인 댓글
  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState<{
    show: boolean;
    commentId: number | null;
  }>({
    show: false,
    commentId: null,
  });
  // 상품 불러오기
  useEffect(() => {
    if (!itemId) return; // Wait for itemId to be available
    console.log(localStorage.getItem("authToken"));
    const fetchProduct = async () => {
      try {
        const data: Product = await productsDetail(itemId as string); // Fetch product data using productsDetail
        console.log("상세페이지 API 응답:", data); // ✅ 여기서 실제 응답 확인
        setProduct(data); // Set product data
      } catch (error) {
        console.log(error);
        alert("로그인이 필요합니다.");
        setError("상품 정보를 불러오는 데 실패했습니다."); // Set error message
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };

    fetchProduct();
  }, [itemId]);

  const handleDeleteProduct = async () => {
    if (!product) return;

    try {
      await productDelete(product.id);
      alert("삭제되었습니다.");
      router.push("/items");
    } catch (error) {
      console.error("삭제 실패:", error);
    }
  };

  useEffect(() => {
    if (!itemId) return;

    // 댓글 불러오기
    const fetchComments = async () => {
      try {
        const data: ProductCommentResponse = await productCommentsGet(
          itemId as string
        );
        setComments(data.list); // Use '목록' instead of 'list'
        console.log("상세페이지 API 응답-댓글확인용:", data); // Log the comments list
      } catch (error) {
        console.error("댓글을 불러오는 데 실패했습니다.", error);
      }
    };

    fetchComments();
  }, [itemId]);

  useEffect(() => {
    console.log("현재 product 상태:", product);
  }, [product]);

  // 댓글 등록
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await productCommentsPost(itemId as string, newComment);
      const updatedCommentsData = await productCommentsGet(itemId as string);
      setComments(updatedCommentsData.list || []); // Set comments from API response (list)
      setNewComment(""); // Clear the input
    } catch (error) {
      console.error("댓글 등록 실패:", error);
    }
  };

  // 댓글 수정
  const handleEditComment = async () => {
    if (!editingComment) return;

    try {
      await productCommentsPatch(editingComment.id, editingComment.content);

      // Immediately update local state
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === editingComment.id
            ? { ...comment, content: editingComment.content }
            : comment
        )
      );

      setEditingComment(null); // Reset editing state
    } catch (error) {
      console.error("댓글 수정 실패:", error);
    }
  };

  // 댓글 수정 취소
  const cancelEditingComment = () => {
    setEditingComment(null);
  };

  // 삭제 버튼 클릭 시 모달 열기
  const handleDeleteClick = (commentId: number) => {
    setShowDeleteCommentModal({ show: true, commentId });
  };

  // 댓글 삭제
  const handleDeleteComment = async () => {
    if (!showDeleteCommentModal.commentId) return;

    try {
      await productCommentsDelete(showDeleteCommentModal.commentId);

      // Update state immediately after deletion
      setComments((prevComments) =>
        prevComments.filter(
          (comment) => comment.id !== showDeleteCommentModal.commentId
        )
      );

      setShowDeleteCommentModal({ show: false, commentId: null }); // Close modal
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
    }
  };

  // 좋아요 기능은 로그인이 필요
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
    setProduct({
      ...product,
      isFavorite: updatedIsFavorite,
      favoriteCount: updatedFavoriteCount,
    });

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
      setProduct({
        ...product,
        isFavorite: product.isFavorite,
        favoriteCount: product.favoriteCount,
      });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>상품을 찾을 수 없습니다.</div>;

  console.log("현재 comments 상태:", comments);
  console.log("comments 배열 여부:", Array.isArray(comments));
  console.log("comments 길이:", comments?.length);

  return (
    <div className="flex flex-col items-center">
      <div className="w-[343px] sm:w-[343px] md:w-[696px] lg:w-[1200px] mt-[24px] mb-[324px] sm:mb-[324px] md:mb-[503px] lg:mb-[443px]">
        {/* 게시글 */}
        <div className="flex justify-between pb-[24px] sm:pb-[24px] md:pb-[32px] lg:pb-[40px] border-b border-gray-200">
          {product.images.map((image, index) => (
            <Image
              key={index}
              src={getImageUrl(image)}
              alt={product.name}
              width={486}
              height={486}
              className="w-[343px] h-[343px] sm:w-[340px] sm:h-[340px] md:w-[340px] md:h-[340px] lg:w-[486px] lg:h-[486px] rounded-[8px]"
            />
          ))}
          <div className="flex flex-col w-[344px] sm:w-[344px] md:w-[340px] lg:w-[690px]">
            {/* 게시글 제목과 가격을 배치하는 div */}
            <div className="flex flex-col gap-[10px] border-b border-gray-200">
              <div className="flex justify-between text-gray-800 text-[24px] font-semibold leading-[32px] ">
                {product.name}
                <ProductDropdown
                  itemId={String(product.id)}
                  onDelete={() => setShowDeleteModal(true)}
                />
              </div>
              <div className="text-gray-800 text-[40px] font-semibold leading-[100%] mb-[16px]">
                {product.price.toLocaleString()} 원
              </div>
            </div>
            <div className="flex flex-col gap-[24px] mt-[16px] sm:mt-[16px] md:mt-[16px] lg:mt-[24px]">
              {/* 상품 소개와 상품 태그를 배치하는 div */}
              <div>
                <div className="font-semibold text-[16px] leading-[26px] text-gray-600 mb-[8px] sm:mb-[8px] md:mb-[8px] lg:mb-[16px]">
                  상품소개
                </div>
                <p className="font-normal text-[16px] leading-[26px] text-gray-600">
                  {product.description}
                </p>
              </div>
              <div>
                <div className="font-semibold text-[16px] leading-[26px] text-gray-600 mb-[8px] sm:mb-[8px] md:mb-[8px] lg:mb-[16px]">
                  상품 태그
                </div>
                <ul className="flex gap-[8px]">
                  {product.tags.map((tag, index) => (
                    <li
                      key={index}
                      className="h-[36px] rounded-[26px] px-[16px] py-[6px] bg-gray-100 font-normal text-[16px] leading-[26px] text-gray-800"
                    >
                      #{tag}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* 게시글 작성정보 */}
            <div className="flex justify-between items-center mt-auto">
              <div className="flex justify-between items-center gap-[16px]">
                <Image
                  src="/assets/ic_profile.png"
                  alt="profile image"
                  width={40}
                  height={40}
                  className="w-[40px] h-[40px] "
                />
                <div className="flex flex-col">
                  <div className="font-medium text-[14px] leading-[24px] text-gray-600">
                    {product.ownerNickname}
                  </div>
                  <div className="font-normal text-[14px] leading-[24px] text-gray-400">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <button
                onClick={handleFavorite}
                className="flex items-center justify-center whitespace-nowrap h-[32px] sm:h-[32px] md:h-[32px] lg:h-[40px] rounded-[35px] px-[12px] py-[4px] gap-[10px] border border-gray-200 "
              >
                <Image
                  src={
                    product.isFavorite
                      ? "/assets/ic_heart.png"
                      : "/assets/ic_noneheart.png"
                  }
                  alt="좋아요"
                  width={32}
                  height={32}
                />
                {product.favoriteCount}
              </button>
            </div>
            {showDeleteModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md w-[298px] bg-white">
                  <Image
                    src="/assets/ic_check.png"
                    alt="삭제 모달창"
                    width={24}
                    height={24}
                    className="mb-[24px]"
                  />
                  <p className="mb-[32px]">정말로 상품을 삭제하시겠어요?</p>
                  <div className="flex justify-center gap-4">
                    <button
                      className="w-[88px] h-[48px] px-[23px] py-[12px] rounded-[8px] text-error bg-gray-50 border border-error "
                      onClick={() => setShowDeleteModal(false)}
                    >
                      취소
                    </button>
                    <button
                      className="w-[88px] h-[48px] px-[23px] py-[12px] rounded-[8px] text-gray-100 bg-error "
                      onClick={handleDeleteProduct}
                    >
                      네
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* 댓글 입력*/}
        <div className="font-semibold text-[16px] leading-[26px] text-gray-900 mt-[24px] sm:mt-[24px] md:mt-[40px] lg:mt-[40px]">
          문의하기
        </div>
        <div className="flex flex-col items-end ">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="mt-[9px] mb-[16px] bg-gray-100 w-full h-[129px] sm:h-[129px] md:h-[104px] lg:h-[104px] rounded-[12px] px-[24px] py-[16px] text-medium text-[14px] leading-[26px] placeholder-gray-400 "
            placeholder="개인정보를 공유 및 요청하거나, 명예 훼손, 무단 광고, 불법 정보 유포시 모니터링 후 삭제될 수 있으며, 이에 대한 민형사상 책임은 게시자에게 있습니다."
          />
          <button
            onClick={handleAddComment}
            className="bg-gray-400 h-[42px] rounded-[8px] px-[23px] py-[12px] font-semibold text-[16px] leading-[26px] text-gray-100 flex items-center justify-center whitespace-nowrap"
          >
            등록
          </button>
        </div>
        {/* 댓글 목록 */}
        {comments.length > 0 ? (
          <ul className="mt-[40px] sm:mt-[40px] md:mt-[40px] lg:mt-[24px]">
            {comments.map((comment) => (
              <li key={comment.id}>
                {editingComment?.id === comment.id ? (
                  <div>
                    <input
                      type="text"
                      value={editingComment.content}
                      onChange={(e) =>
                        setEditingComment({
                          ...editingComment,
                          content: e.target.value,
                        })
                      }
                      className="bg-gray-100 w-full h-[80px] rounded-[12px] px-[24px] py-[16px] mb-[16px]"
                    />
                    <div className="flex justify-end gap-[4px]">
                      <button
                        onClick={cancelEditingComment}
                        className="flex items-center px-[23px] py-[12px] font-semibold text-[16px] leading-[26px] text-gray-500"
                      >
                        취소
                      </button>
                      <button
                        onClick={handleEditComment}
                        className="flex items-center bg-primary-100 h-[42px] rounded-[8px] px-[23px] py-[12px]
                    font-semibold text-[16px] leading-[26px] text-gray-100"
                      >
                        수정 완료
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-[24px] pb-[12px] mb-[16px] sm:mb-[16px] md:mb-[24px] lg:mb-[24px] border-b border-gray-200">
                    <div className="flex justify-between">
                      <p className="font-normal text-[14px] leading-[24px] text-gray-800">
                        {comment.content}
                      </p>
                      <EditCommentDropdown
                        commentId={comment.id}
                        onEdit={() => {
                          console.log("수정 클릭됨");
                          setEditingComment({
                            id: comment.id,
                            content: comment.content,
                          });
                        }}
                        onDelete={() => {
                          console.log("삭제 클릭됨");
                          handleDeleteClick(comment.id);
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-[8px]">
                      <Image
                        src={getProfileImgUrl(comment.writer.image)}
                        alt="writer profile image"
                        width={32}
                        height={32}
                        className="w-[32px] h-[32px]"
                      />
                      <div className="flex flex-col">
                        <span className="font-normal text-[12px] leading-[18px] text-gray-600">
                          {comment.writer.nickname}
                        </span>
                        <span className="font-normal text-[12px] leading-[18px] text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center mt-[40px] sm:mt-[40px] md:mt-[40px] lg:mt-[24px] mb-[48px]">
            <Image
              src="/assets/Img_inquiry_empty.png"
              alt="no comment"
              width={196}
              height={196}
              className="w-[140px] sm:w-[140px] md:w-[140px] lg:w-[196px] h-[140px] sm:h-[140px] md:h-[140px] lg:h-[196px]"
            />
            <p className="font-normal text-[16px] leading-[26px] text-gray-400">
              아직 문의가 없어요
            </p>
          </div>
        )}
        <div className="flex justify-center">
          <Link href="/items">
            <button
              className="flex justify-center items-center gap-[8px] w-[240px] h-[48px] rounded-[40px] px-[64px] py-[12px] bg-primary-100 whitespace-nowrap
          font-semibold text-[18px] leading-[26px] text-gray-100 mt-[40px] sm:mt-[40px] md:mt-[56px] lg:mt-[64px]"
            >
              목록으로 돌아가기
              <Image
                src="/assets/ic_back.png"
                alt="back"
                width={24}
                height={24}
              />
            </button>
          </Link>
        </div>
        {showDeleteCommentModal.show && (
          <div className="modal">
            <p>정말로 삭제하시겠습니까?</p>
            <button onClick={handleDeleteComment}>삭제</button>
            <button
              onClick={() =>
                setShowDeleteCommentModal({ show: false, commentId: null })
              }
            >
              취소
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemDetail;
