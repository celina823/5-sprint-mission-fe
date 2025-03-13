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
} from "@/services/products";
import Image from "next/image";
import { EditDropdownMenu } from "@/global/components/EditDropdownMenu";

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
  // 댓글 CRUD 시 사용
  const [newComment, setNewComment] = useState<string>(""); // 입력된 새 댓글
  const [editingComment, setEditingComment] = useState<{ id: number; content: string } | null>(null); // 수정 중인 댓글
  const [showDeleteModal, setShowDeleteModal] = useState<{ show: boolean; commentId: number | null }>({
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
        setError("상품 정보를 불러오는 데 실패했습니다."); // Set error message
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };

    fetchProduct();
  }, [itemId]);

  useEffect(() => {
    if (!itemId) return;

    // 댓글 불러오기
    const fetchComments = async () => {
      try {
        const data: ProductCommentResponse = await productCommentsGet(itemId as string);
        setComments(data.list);  // Use '목록' instead of 'list'
        console.log("상세페이지 API 응답-댓글확인용:", data.list); // Log the comments list
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
      setComments(updatedCommentsData.list || []);  // Set comments from API response (list)
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


  // 삭제 버튼 클릭 시 모달 열기
  const handleDeleteClick = (commentId: number) => {
    setShowDeleteModal({ show: true, commentId });
  };

  // 댓글 삭제
  const handleDeleteComment = async () => {
    if (!showDeleteModal.commentId) return;

    try {
      await productCommentsDelete(showDeleteModal.commentId);

      // Update state immediately after deletion
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== showDeleteModal.commentId)
      );

      setShowDeleteModal({ show: false, commentId: null }); // Close modal
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

  // 이미지 깨지는거 처리
  const getImageUrl = (image: string | null | undefined) => {
    if (!image || image.trim() === "" || image.startsWith("https://example.com")) {
      return "/assets/img_default.png"; // 기본 이미지 경로
    }
    return image; // 유효한 이미지 URL인 경우 원본 이미지 사용
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>상품을 찾을 수 없습니다.</div>;

  console.log("현재 comments 상태:", comments);
  console.log("comments 배열 여부:", Array.isArray(comments));
  console.log("comments 길이:", comments?.length);

  return (
    <>
      {/* 게시글 */}
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
              src={getImageUrl(image)}
              alt={product.name}
              width={300}
              height={200}
              layout="intrinsic" // ✅ 최적화된 이미지 로딩 방식 적용
            />
          ))}
        </div>
      </div>
      <button onClick={handleFavorite}>{product.isFavorite ? "좋아요 취소" : "좋아요"}</button>

      <h2>댓글</h2>
      <div>
        <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="댓글 입력" />
        <button onClick={handleAddComment}>등록</button>
      </div>

      {comments.length > 0 ? (
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              {editingComment?.id === comment.id ? (
                <div>
                  <input
                    type="text"
                    value={editingComment.content}
                    onChange={(e) => setEditingComment({ ...editingComment, content: e.target.value })}
                  />
                  <button onClick={handleEditComment}>수정 완료</button>
                </div>
              ) : (
                <div>
                  <p>{comment.content}</p>
                  <span>{comment.writer.nickname}</span>
                  <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                  <EditDropdownMenu
                    commentId={comment.id}
                    onEdit={() => {
                      console.log("수정 클릭됨");
                      setEditingComment({ id: comment.id, content: comment.content });
                    }}
                    onDelete={() => {
                      console.log("삭제 클릭됨");
                      handleDeleteClick(comment.id);
                    }}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <Image
            src="/assets/Img_inquiry_empty.png"
            alt="no comment"
            width={140}
            height={140}
          />
          <p>아직 댓글이 없습니다.</p>
        </div>
      )}

      {showDeleteModal.show && (
        <div className="modal">
          <p>정말로 삭제하시겠습니까?</p>
          <button onClick={handleDeleteComment}>삭제</button>
          <button onClick={() => setShowDeleteModal({ show: false, commentId: null })}>취소</button>
        </div>
      )}
    </>
  );
};

export default ItemDetail;
