import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";

interface Article {
  id: string;
  title: string;
  content: string;
}

interface EditArticleProps {
  article: Article | null;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };
  let article = null;

  if (id) {
    try {
      const res = await fetch(`https://five-sprint-mission-be-mission7-kqwz.onrender.com/article/${id}`);
      article = await res.json();
    } catch (error) {
      console.error("게시글 데이터를 가져오는 중 오류 발생:", error);
    }
  }

  return {
    props: { article },
  };
};

const WriteOrEditArticle = ({ article }: EditArticleProps) => {
  const router = useRouter();
  const [title, setTitle] = useState<string>(article?.title || "");
  const [content, setContent] = useState<string>(article?.content || "");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  // 제목과 내용이 입력되었는지 확인
  useEffect(() => {
    if (title && content) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [title, content]);

  // 게시글 작성 또는 수정 처리 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleSubmit 함수 실행됨");

    if (!title || !content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    const articleData = {
      nickname: "익명의 판다",
      title,
      content,
    };

    try {
      let res, newArticle;
      if (article) {
        // 수정: PATCH 요청
        res = await fetch(`https://five-sprint-mission-be-mission7-kqwz.onrender.com/article/${article.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(articleData),
        });
      } else {
        // 작성: POST 요청
        res = await fetch("https://five-sprint-mission-be-mission7-kqwz.onrender.com/article", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(articleData),
        });
      }

      console.log("서버 응답 상태 코드:", res.status);
      console.log("서버 응답 헤더:", res.headers);

      if (!res.ok) {
        throw new Error(`서버 응답 오류: ${res.status}`);
      }

      // 응답이 JSON인지 확인 후 파싱
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        newArticle = await res.json();
        console.log("새 게시글 응답:", newArticle);
      } else {
        console.warn("JSON 응답이 아님:", await res.text());
        newArticle = null;
      }

      alert(article ? "게시글이 수정되었습니다." : "게시글이 작성되었습니다.");

      // 폼 초기화
      setTitle("");  // 제목 초기화
      setContent("");  // 내용 초기화

      if (article) {
        router.push(`/article/${article.id}`);
      } else {
        console.log("새 게시글 ID 확인:", newArticle?.id);
        await router.push(newArticle?.id ? `/article/${newArticle.id}` : "/freeboard");
      }
    } catch (error) {
      console.error("게시글 처리 중 오류 발생:", error);
      alert("게시글 처리에 실패했습니다.");
    }
  };




  return (
    <div className="w-[1200px] mx-auto mt-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">{article ? "게시글 수정" : "게시글 쓰기ㄱㄱ"}</h1>
        <button
          type="submit"
          onClick={handleSubmit}
          className={`px-6 py-3 rounded-md text-white ${isFormValid ? "bg-Primary_100" : "bg-gray_400"}`}
          disabled={!isFormValid}
        >
          {article ? "수정 완료" : "등록"}
        </button>
      </div>
      <form onSubmit={handleSubmit} className="mt-6">
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="제목을 입력하세요"
          />
        </div>
        <div className="mt-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="내용을 입력하세요"
          />
        </div>
      </form>
    </div>
  );
};

export default WriteOrEditArticle;
