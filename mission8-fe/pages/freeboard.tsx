//검색목록 ssr로 구현
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

// SSR 방식으로 서버에서 데이터를 가져옵니다.
export const getServerSideProps = async () => {
  try {
    // API 호출해서 데이터 가져오기
    const res = await fetch('https://five-sprint-mission-be-mission7-kqwz.onrender.com/article');
    const data = await res.json();
    // data에서 articles 배열만 추출
    const articles = Array.isArray(data.articles) ? data.articles : [];

    // 좋아요(Heart) 순으로 정렬 후 상위 3개 추출
    const topArticles = [...articles]
      .sort((a, b) => b.Heart - a.Heart) // 내림차순 정렬 (많은 순)
      .slice(0, 3); // 상위 3개만 추출

    // 서버에서 날짜를 포맷팅하여 전달 💛
    const formattedArticles = articles.map((article: Article) => ({
      ...article,
      createdAt: new Date(article.createdAt).toISOString(), // 서버에서 날짜를 ISO 문자열로 변환
    }));

    return {
      props: {
        articles: formattedArticles,
        topArticles,
      }
    };
  } catch (error) {
    console.error("Error fetching articles:", error);
    return {
      props: {
        articles: [],
        topArticles: [],
      }
    };
  }
}

interface Article {
  id: string;
  title: string;
  image: string | null;
  nickname: string;
  createdAt: string;
  Heart: number;
}

interface FreeboardProps {
  articles: Article[]; //그냥 게시글
  topArticles: Article[]; //베스트 게시글
}

export default function Freeboard({ articles, topArticles }: FreeboardProps) {

  if (!Array.isArray(articles)) {
    return <div>데이터 오류: 게시글을 가져오는 데 문제가 발생했습니다.</div>;
  }

  const router = useRouter();

  // 드롭다운 설정 - 최신 순, 좋아요 순
  const [isClient, setIsClient] = useState(false);  // Client-side rendering check
  const [sortType, setSortType] = useState<"latest" | "heart">("latest");
  const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태 추가 💛

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 검색어 필터링 💛
  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) // 제목으로 필터링
  );

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (sortType === "latest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // 최신순 (
    } else {
      return b.Heart - a.Heart; // 좋아요 순 
    }
  });

  // 이미지 URL이 없을 경우 기본 이미지 설정
  const getImageUrl = (image: string | null) => {
    return image && image.trim() !== "" ? image : '/assets/img_default.png';
  }

  if (!isClient) {
    return null; // Prevent SSR mismatch on the first render
  }

  if (!articles || articles.length === 0) {
    return <div>로딩 중...</div>;
  }
  console.log("확인용", articles)

  return (
    <div className="w-[1200px] mx-auto mt-6">
      <div>베스트 게시글</div>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {topArticles.map((article) => (
          <Link key={article.id} href={`/article/${article.id}`} passHref>
            <div className="bg-gray_50 p-4 rounded-lg ">
              <div className="flex justify-between items-center"> {/*게시글 제목과 이미지를 배치하기 위한 div*/}
                <p className="font-semibold text-[20px] leading-[32px] w-[calc(100%-120px)] line-clamp-2">
                  {article.title}
                </p> {/* 제목 (최대 2줄 표시, 초과 시 "..." 처리) */}
                <img
                  src={getImageUrl(article.image)}
                  alt={article.title}
                  className="h-[72px] w-[72px] rounded-[8px] border border-gray_200 mt-2"
                />
              </div>
              <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                <p>{article.nickname}</p>
                <p><Image
                  src="/assets/ic_heart.png" // public 폴더 내의 이미지 경로
                  alt="Heart Icon"
                  width={24}
                  height={24}
                /> {article.Heart}</p>
                <p className="text-[14px]"> {article.createdAt}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="flex justify-between items-center"> {/*게시글과 글쓰기 버튼을 배치하기 위한 div*/}
        <div>게시글</div>
        <button
          onClick={() => router.push("/write-article/new")}
          className="bg-Primary_100 text-white h-[42px] px-[23px] py-[12px] rounded-[8px] flex items-center justify-center"
        >글쓰기</button>
      </div>
      <div className="flex justify-between items-center"> {/*input과 드롭다운을 배치하기 위한 div*/}
        <input
          placeholder="검색할 상품을 입력해주세요"
          className="bg-gray_100"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // 검색어 입력 처리 💛
        />
        <select
          className="border border-gray-300 rounded-md px-4 py-2"
          value={sortType}
          onChange={(e) => setSortType(e.target.value as "latest" | "heart")}
        >
          <option value="latest">최신 순</option>
          <option value="heart">좋아요 순</option>
        </select>
      </div>
      <div className="space-y-6">
        {sortedArticles.map((article, index) => (
          <Link key={article.id} href={`/article/${article.id}`} passHref>
            <div className="bg-[#fcfcfc] border-b border-gray_200">
              <div className="flex justify-between items-start"> {/*게시글 제목과 이미지를 배치하기 위한 div*/}
                <p className="font-semibold text-[20px] leading-[32px]">{article.title}</p>
                <img src={getImageUrl(article.image)} alt={article.title} className="h-[72px] w-[72px] rounded-[8px] border border-gray_100" />
              </div>
              <div className="flex justify-between items-center"> {/*게시글 닉네임,작성일, 좋아요를 배치하기 위한 div*/}
                <div className="flex space-x-2">
                  <p className="text-[14px]">{article.nickname}</p>
                  <p className="text-[14px]"> {article.createdAt}</p>
                </div>
                <p className="flex text-[16px]">
                  <Image
                    src="/assets/ic_heart.png" // public 폴더 내의 이미지 경로
                    alt="Heart Icon"
                    width={24}
                    height={24}
                  />
                  {article.Heart}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
