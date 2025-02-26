// pages/write-article/new.tsx
import { useState } from "react";
import { useRouter } from "next/router";

const NewArticle = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

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
    <div className="w-[1200px] mx-auto mt-6">
      <h1 className="text-2xl font-semibold">게시글 쓰기</h1>
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
        <button
          type="submit"
          className="mt-6 bg-Primary_100 text-white h-[42px] px-[23px] py-[12px] rounded-[8px]"
        >
          등록
        </button>
      </form>
    </div>
  );
};

export default NewArticle;
