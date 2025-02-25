import { GetServerSideProps } from "next";
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

    // 게시글이 없다면 404 페이지로 리디렉션 ✅
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

export default function ArticleDetail({ article, comments }: ArticleDetailProps) {
  if (!article) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }
  console.log("받은 댓글 데이터:", comments);
  return (
    <div className="w-[1200px] mx-auto mt-6">
      <div className="bg-gray_50 p-6 rounded-lg">
        <h1 className="text-2xl font-semibold">{article.title}</h1>
        <img src={getImageUrl(article.image)} alt={article.title} className="h-[300px] w-[300px] rounded-md mt-4" />
        <div className="mt-4">{article.content}</div>
        <div className="mt-4 text-sm text-gray-500">작성자: {article.nickname}</div>
        <div className="mt-2 text-sm text-gray-500">작성일: {article.createdAt}</div>
        <div className="mt-2 text-sm text-gray-500">
          <span>좋아요: {article.Heart}</span>
        </div>

        {/* 댓글 */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold">댓글</h3>
          <div>
            {comments?.length > 0 ? (
              comments.map((comment, index) => (
                <div key={index} className="mt-4">
                  <div className="font-medium">{comment.userId}</div>
                  <div className="text-sm">{comment.content}</div>
                  <div className="text-xs text-gray-500">{comment.createdAt}</div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center mt-4">
                <Image
                  src="/assets/Img_reply_empty.png" // 코멘트 없을 때 이미지
                  alt="댓글 없음"
                  width={140} // 원하는 크기 지정
                  height={140}
                />
                <p className="text-gray-400 mt-2">아직 댓글이 없어요, 지금 댓글을 달아보세요!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
