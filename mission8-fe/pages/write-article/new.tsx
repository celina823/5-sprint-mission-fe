// pages/write-article/new.tsx
import { useState } from "react";
import { useRouter } from "next/router";

const NewArticle = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const isDisabled = !title.trim() || !content.trim(); // 둘 중 하나라도 비어 있으면 비활성화

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
      const res = await fetch("https://five-sprint-mission-be-mission7-kqwz.onrender.com/article", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(articleData),
      });

      if (!res.ok) {
        throw new Error(`서버 응답 오류: ${res.status}`);
      }

      const newArticle = await res.json();
      alert("게시글이 작성되었습니다.");

      // 작성 후 게시글 상세 페이지로 이동
      router.push(`/article/${newArticle.id}`);
    } catch (error) {
      console.error("게시글 작성 오류:", error);
      alert("게시글 작성에 실패했습니다.");
    }
  };

  return (
    <div className="w-[343px] lg:w-[1200px] md:w-[696px] sm:w-[343px] mx-auto mt-[16px] lg:mt-[24x] md:mt-[16px] sm:mt-[16px] mb-[965px] lg:mb-[794px] md:mb-[879px] sm:mb-[965px]">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between items-center mb-[24px] lg:mb-[32px] md:mb-[32px] sm:mb-[24px] ">
          <h1 className="text-gray_800 font-bold text-[20px] leading-[32px]">게시글 쓰기</h1>
          <button
            type="submit"
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
            className="w-full h-[56px] rounded-[12px] px-[24px] py-[16px] bg-gray_100 text-gray_400 font-normal text-[16px] leading-[26px]"
            placeholder="제목을 입력해주세요"
          />
        </div>
        <div className="mt-[16px] lg:mt-[24px] md:mt-[24px] sm:mt-[16px]">
          <div className="text-gray_800 font-bold text-[18px] leading-[26px] mb-[12px]">*내용</div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-[282px] rounded-[12px] px-[24px] py-[16px] bg-gray_100 text-gray_400 font-normal text-[16px] leading-[26px]"
            placeholder="내용을 입력해주세요"
          />
        </div>

      </form>
    </div>
  );
};

export default NewArticle;
