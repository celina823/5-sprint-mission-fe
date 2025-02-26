import { GetServerSideProps } from "next";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

interface Article {
  id: string;
  title: string;
  content: string;
  image: string;
  nickname: string;
  createdAt: string;
  Heart: number;
}

interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}

interface ArticleDetailProps {
  article: Article | null; //게시물 없을 경우 null 처리
  comments: Comment[];
}

// 🔹 getServerSideProps에서 article이 undefined일 경우 null을 반환하도록 수정
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string }; // URL 파라미터로 게시글 ID 받기

  try {
    // 게시글 데이터 가져오기
    const articleRes = await fetch(`https://five-sprint-mission-be-mission7-kqwz.onrender.com/article/${id}`);
    const articleData = await articleRes.json();
    console.log("게시글 확인용:", articleData);

    // 게시글이 없다면 404 페이지로 리디렉션
    if (!articleData || articleRes.status !== 200) {
      return { notFound: true }; // 게시글이 없으면 404 페이지 리디렉션
    }

    // 댓글 데이터 가져오기
    const commentRes = await fetch(`https://five-sprint-mission-be-mission7-kqwz.onrender.com/comment/${id}`);
    const commentData = await commentRes.json();
    console.log("코멘트 확인용:", commentData);

    // 댓글 데이터의 실제 배열을 반환
    const comments = Array.isArray(commentData.comments) ? commentData.comments : [];

    return {
      props: {
        article: articleData ?? null, // 게시글 데이터
        comments,
      },
    };
  } catch (error) {
    console.error("🚨 Error fetching article or comments:", error);
    return {
      props: {
        article: null, // 에러 발생 시에도 null 반환
        comments: [],
      },
    };
  }
};

// 이미지 URL이 없을 경우 기본 이미지 설정
const getImageUrl = (image: string | null) => {
  return image && image.trim() !== "" ? image : '/assets/img_default.png';
}

//////////////////////////////////////////////////

export default function ArticleDetail({ article, comments }: ArticleDetailProps) {
  if (!article) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  const [isArticleDropdownOpen, setIsArticleDropdownOpen] = useState(false); // ✅ 게시글 드롭다운 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false); // ✅ 삭제 모달 상태 관리
  const [newComment, setNewComment] = useState(""); // ✅ 새로운 댓글을 입력하는 input의 값을 관리
  const [commentList, setCommentList] = useState<Comment[]>(comments); // ✅ 댓글 목록을 상태로 관리
  const [dropdownOpenCommentId, setDropdownOpenCommentId] = useState<string | null>(null); // 특정 댓글 드롭다운 상태 관리
  const [editCommentId, setEditCommentId] = useState<string | null>(null); // 수정 중인 댓글 ID 저장
  const [editedComment, setEditedComment] = useState(""); // 수정 중인 댓글 내용

  const router = useRouter();

  ///게시글 CRUD 

  // ✅ 게시글 드롭다운 메뉴 토글 함수
  const toggleDropdownArticle = () => {
    setIsArticleDropdownOpen((prev) => !prev);
  };

  // ✅ 수정하기 버튼 클릭 시 수정 페이지로 이동
  const handleEdit = () => {
    router.push(`/write-article/${article?.id}`); // 수정 페이지로 이동
  };

  // ✅ 삭제하기 버튼 클릭 시 모달 열기
  const handleDelete = () => {
    setIsModalOpen(true); // 삭제 모달 열기
    setIsArticleDropdownOpen(false); // 드롭다운 메뉴 닫기
  };

  // ✅ 삭제 확인 함수
  const confirmDelete = async () => {
    try {
      await fetch(`https://five-sprint-mission-be-mission7-kqwz.onrender.com/article/${article?.id}`, {
        method: 'DELETE', // DELETE 요청으로 게시글 삭제
      });
      router.push('/freeboard'); // 삭제 후 자유게시판 페이지로 리디렉션
    } catch (error) {
      console.error('삭제 실패:', error);
    }
  };

  // ✅ 삭제 취소 함수
  const cancelDelete = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  ///댓글 CRUD

  const toggleDropdownComment = (commentId: string) => {
    setDropdownOpenCommentId((prev) => (prev === commentId ? null : commentId));
  };

  // ✅ 댓글 목록을 다시 불러오는 함수
  const fetchComments = async () => {
    try {
      const response = await fetch(`https://five-sprint-mission-be-mission7-kqwz.onrender.com/comment/${article?.id}`);
      const data = await response.json();
      setCommentList(Array.isArray(data.comments) ? data.comments : []); // ✅ 최신 댓글 목록으로 업데이트
    } catch (error) {
      console.error("댓글 목록을 불러오는 중 오류 발생:", error);
    }
  };

  // ✅ 댓글 등록 함수
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return; // 빈 댓글 방지

    const commentData = {
      userId: "비로그인판다", // ✅ 아직 로그인 기능이 없으므로 고정된 userId로
      content: newComment,
      articleId: article.id,
      createdAt: new Date().toISOString(),
    };

    console.log("댓글 데이터 확인:", commentData);

    try {
      const res = await fetch(`https://five-sprint-mission-be-mission7-kqwz.onrender.com/comment/${article?.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentData),
      });

      if (res.ok) {
        const newComment = await res.json(); // 서버에서 반환된 댓글 데이터 (Comment 객체)

        // ✅ 네트워크 요청 없이 로컬 상태 즉시 업데이트
        setCommentList((prevComments) => [...prevComments, newComment]);

        setNewComment(""); // 입력 필드 초기화
      } else {
        console.error("댓글 등록 실패");
      }
    } catch (error) {
      console.error("댓글 등록 중 오류 발생:", error);
    }
  };

  // 댓글 수정 시작
  const startEditingComment = (comment: Comment) => {
    setEditCommentId(comment.id);
    setEditedComment(comment.content);
    setDropdownOpenCommentId(null);
  };

  // 댓글 수정 저장
  const saveEditedComment = async (commentId: string) => {
    try {
      await fetch(`https://five-sprint-mission-be-mission7-kqwz.onrender.com/comment/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editedComment }),
      });
      // 로컬 상태에서 댓글 업데이트
      setCommentList((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId ? { ...comment, content: editedComment } : comment
        )
      );
      // 수정 완료 후 상태 초기화
      setEditCommentId(null);
      setEditedComment("");
    } catch (error) {
      console.error("댓글 수정 중 오류 발생:", error);
    }
  };

  // 댓글 수정 취소
  const cancelEditingComment = () => {
    setEditCommentId(null); // 수정 중인 댓글 ID 초기화
    setEditedComment(""); // 수정된 내용 초기화
  };

  // 댓글 삭제
  const deleteComment = async (commentId: string) => {
    try {
      await fetch(`https://five-sprint-mission-be-mission7-kqwz.onrender.com/comment/${commentId}`, {
        method: "DELETE",
      });
      setCommentList((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("댓글 삭제 중 오류 발생:", error);
    }
  };

  // 댓글 목록을 useEffect로 자동 업데이트
  useEffect(() => {
    if (article?.id) {
      fetchComments();
    }
  }, [article?.id]);

  return (
    <div className="w-[1200px] mx-auto mt-[34px]">
      <div>
        <div className="flex justify-between"> {/* 제목과 케밥 아이콘을 배치하기 위한 div*/}
          <h1 className="text-2xl font-semibold">{article.title}</h1>
          <div className="ml-2 relative">
            <Image
              src="/assets/ic_kebab.png" // ✅ ic_kebab 아이콘 추가
              alt="Kebab Menu"
              width={24}
              height={24}
              onClick={toggleDropdownArticle} // ✅ 아이콘 클릭 시 드롭다운 메뉴 토글
            />
            {isArticleDropdownOpen && ( // ✅ 드롭다운 메뉴 표시
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border">
                <button
                  className="w-full text-left px-4 py-2 text-sm"
                  onClick={handleEdit} // ✅ 수정하기 클릭 시 수정 페이지로 이동
                >
                  수정하기
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm"
                  onClick={handleDelete} // ✅ 삭제하기 클릭 시 삭제 모달 열기
                >
                  삭제하기
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex "> {/*작성자,작성일과 좋아요 버튼을 배치하기 위한 div*/}
          <div className="flex items-center justify-center">작성자: {article.nickname}</div>
          <div className="flex items-center justify-center">작성일: {article.createdAt}</div>
          <div className="flex items-center justify-center rounded-[35px] border border-gray_200 px-[12px] py-[4px]">
            <p className="flex text-[16px]">
              <Image
                src="/assets/ic_heart.png"
                alt="Heart Icon"
                width={24}
                height={24}
              />
              {article.Heart}</p>
          </div>

        </div>
        <div className="mt-4">{article.content}</div>
        {/* <div>첨부이미지</div>
        <img src={getImageUrl(article.image)} alt={article.title} className="h-[150px] w-[150px] rounded-md mt-4" /> */}

        {/* 댓글달기 */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold">댓글 달기</h3>
          <input
            value={newComment} // ✅ 입력 상태 연결
            onChange={(e) => setNewComment(e.target.value)} // ✅ 입력 값 업데이트
            placeholder="댓글을 입력해주세요"
            className="bg-gray_100 h-[104px] w-full p-2 rounded-[12px] "
          />
          <button onClick={handleCommentSubmit} className={` text-white px-[23px] py-[12px] rounded-md ${newComment.trim() ? "bg-Primary_100" : "bg-gray-400 cursor-not-allowed"
            }`}>
            등록
          </button>
        </div>

        {/* 댓글 */}
        <div className="mt-6">
          <div>
            {commentList?.length > 0 ? (
              commentList.map((comment, index) => (
                <div key={index} className="mt-6 bg-[#fcfcfc] border-b border-gray_200">
                  <div className="flex justify-between"> {/* 댓글내용과 케밥 아이콘을 배치하기 위한 div*/}
                    <div className="text-sm">{comment.content}</div>
                    <div className="ml-2 relative">
                      <Image
                        src="/assets/ic_kebab.png" // ✅ ic_kebab 아이콘 추가
                        alt="Kebab Menu"
                        width={24}
                        height={24}
                        onClick={() => toggleDropdownComment(comment.id)}  // ✅ 아이콘 클릭 시 드롭다운 메뉴 토글
                      />
                      {dropdownOpenCommentId === comment.id && ( // ✅ 드롭다운 메뉴 표시
                        <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border">
                          <button
                            className="w-full text-left px-4 py-2 text-sm"
                            onClick={() => startEditingComment(comment)} // 수정하기 클릭 시 수정 상태로 전환
                          >
                            수정하기
                          </button>
                          <button
                            className="w-full text-left px-4 py-2 text-sm"
                            onClick={() => deleteComment(comment.id)} // 댓글 삭제하기
                          >
                            삭제하기
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 댓글 수정 입력창이 표시될 경우 */}
                  {editCommentId === comment.id ? (
                    <div className="mt-2">
                      <input
                        type="text"
                        value={editedComment} // 수정된 내용 연결
                        onChange={(e) => setEditedComment(e.target.value)} // 입력값 업데이트
                        className="w-full p-2 rounded-md border"
                      />
                      <div className="mt-2 flex space-x-4">
                        <button
                          onClick={() => saveEditedComment(comment.id)} // 수정 확인 버튼
                          className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                          확인
                        </button>
                        <button
                          onClick={cancelEditingComment} // 수정 취소 버튼
                          className="px-4 py-2 bg-gray-300 text-black rounded"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Image
                        src="/assets/ic_profile.png"
                        alt="Profile Image Icon"
                        width={32}
                        height={32}
                      />
                      <div className="font-normal text-xs leading-5 text-gray_600">{comment.userId}</div>
                      <div className="font-normal text-xs leading-5 text-gray_400">{comment.createdAt}</div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center mt-4">
                <Image
                  src="/assets/Img_reply_empty.png"
                  alt="댓글 없음"
                  width={140}
                  height={140}
                />
                <p className="text-gray-400 mt-2">아직 댓글이 없어요, 지금 댓글을 달아보세요!</p>
              </div>
            )}
          </div>
        </div>
        <button className="flex bg-Primary_100 text-white rounded-[40px] px-[64px] py-[12px]">목록으로 돌아가기<Image
          src="/assets/ic_back.png" // public 폴더 내의 이미지 경로
          alt="Back Icon"
          width={24}
          height={24}
        /></button>
        {/* 삭제 확인 모달창 */}
        {isModalOpen && ( // ✅ 삭제 모달 표시
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg text-center">
              <p>정말 삭제하시겠습니까?</p>
              <div className="mt-4 flex justify-center space-x-4">
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded"
                  onClick={confirmDelete} // ✅ 삭제 버튼 클릭 시 게시글 삭제
                >
                  삭제
                </button>
                <button
                  className="px-4 py-2 bg-gray-300 text-black rounded"
                  onClick={cancelDelete} // ✅ 취소 버튼 클릭 시 모달 닫기
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
