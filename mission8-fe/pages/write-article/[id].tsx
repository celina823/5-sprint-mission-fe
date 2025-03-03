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

  const isDisabled = !title.trim() || !content.trim(); // 둘 중 하나라도 비어 있으면 비활성화

  // 게시글 작성 또는 수정 처리 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

      if (!res.ok) {
        throw new Error(`서버 응답 오류: ${res.status}`);
      }

      // 응답이 JSON인지 확인 후 파싱
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        newArticle = await res.json();
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
    <div className="w-[343px] lg:w-[1200px] md:w-[696px] sm:w-[343px] mx-auto mt-[16px] lg:mt-[24x] md:mt-[16px] sm:mt-[16px] mb-[965px] lg:mb-[794px] md:mb-[879px] sm:mb-[965px]">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between items-center mb-[24px] lg:mb-[32px] md:mb-[32px] sm:mb-[24px] ">
          <h1 className="text-gray_800 font-bold text-[20px] leading-[32px]">상품 등록하기</h1>
          <button
            type="submit"
            onClick={handleSubmit}
            className={`flex justify-center items-center h-[42px] px-[23px] py-[12px] rounded-[8px] text-gray_100
              ${isDisabled ? "bg-gray_400 cursor-not-allowed" : "bg-Primary_100"}`}
            disabled={isDisabled}
          >
            등록
          </button>
        </div>
        <div>
          <div className="text-gray_800 font-bold text-[18px] leading-[26px] mb-[12px]">*제목</div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-[56px] rounded-[12px] px-[24px] py-[16px] bg-gray_100 text-gray_600 font-normal text-[16px] leading-[26px]"
            placeholder="제목을 입력해주세요"
          />
        </div>
        <div className="mt-[16px] lg:mt-[24px] md:mt-[24px] sm:mt-[16px]">
          <div className="text-gray_800 font-bold text-[18px] leading-[26px] mb-[12px]">*내용</div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-[282px] rounded-[12px] px-[24px] py-[16px] bg-gray_100 text-gray_600 font-normal text-[16px] leading-[26px]"
            placeholder="내용을 입력해주세요"
          />
        </div>
      </form>
    </div>
  );
};

export default WriteOrEditArticle;
