//검색목록 ssr로 구현
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import CustomDropdown from "@/global/components/CustomDropdown";

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

  const [isClient, setIsClient] = useState(false);  // Client-side rendering check
  const [sortType, setSortType] = useState<"latest" | "heart">("latest"); // 드롭다운 설정 - 최신 순, 좋아요 순
  const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태 
  const [visibleTopArticles, setVisibleTopArticles] = useState<Article[]>([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 화면 너비에 따른 베스트 게시글 수 조정
  useEffect(() => {
    const handleResize = () => {
      // 화면의 너비에 맞춰 보여줄 데이터의 수를 결정
      let articlesToShow = 3; // 기본적으로 3개 (PC)
      if (window.innerWidth < 768) {
        articlesToShow = 1; // 모바일에서는 1개
      } else if (window.innerWidth < 1024) {
        articlesToShow = 2; // 태블릿에서는 2개
      }

      // topArticles에서 필요한 수만큼 추출
      setVisibleTopArticles(topArticles.slice(0, articlesToShow));
    };

    // 처음에 화면 크기 조정
    handleResize();

    // 화면 크기 변경시마다 실행
    window.addEventListener("resize", handleResize);

    // cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [topArticles]);

  // 검색어 필터링
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

  // 날짜 표기방식 변경
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).replace(/. /g, '.').slice(0, -1); // "2025.02.25" 형식으로 변환
  };


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
    <div className=" lg:w-[1200px] md:w-[696px] sm:w-[343px] w-[343px] mx-auto mt-6">
      <div className=" lg:mb-[40px] md:mb-[24px] sm:mb-[24px] mb-[24px]"> {/* 베스트 게시글 전체를 감싸는 div */}
        <div className="text-gray_900 font-bold text-[20px] leading-[23.87px]">베스트 게시글</div>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {visibleTopArticles.map((article) => (
            <Link key={article.id} href={`/article/${article.id}`} passHref>
              <div className="bg-gray_50 px-[24px] pt-[46px] pb-[16px] rounded-lg relative">
                {/* Best 배지 이미지 추가 */}
                <Image
                  src="/assets/img_badge.png"
                  alt="Best Badge"
                  className="absolute top-0 left-[24px]"
                  width={102}
                  height={30}
                />
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
                <div className="flex items-center justify-between items-center mt-[18px] text-sm text-gray-500">
                  <div className="flex gap-[8px]">
                    <p className="text-gray_600">{article.nickname}</p>
                    <p className="text-gray_500 flex items-center gap-[4px]"><Image
                      src="/assets/ic_heart.png" // public 폴더 내의 이미지 경로
                      alt="Heart Icon"
                      width={16}
                      height={16}
                    /> {article.Heart}</p>
                  </div>
                  <p className="text-[14px] text-gray_400">{formatDate(article.createdAt)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center lg:mb-[24px] md:mb-[48px] sm:mb-[16px] mb-[16px]"> {/*게시글과 글쓰기 버튼을 배치하기 위한 div*/}
        <div className="text-gray_900 font-bold text-[20px] leading-[23.87px]">게시글</div>
        <button
          onClick={() => router.push("/write-article/new")}
          className="bg-Primary_100 text-white h-[42px] px-[23px] py-[12px] rounded-[8px] flex items-center justify-center"
        >글쓰기</button>
      </div>
      <div className="flex justify-between items-center"> {/*input과 드롭다운을 배치하기 위한 div*/}
        <div className="relative w-full">
          <input
            placeholder="검색할 상품을 입력해주세요"
            className="bg-gray_100 lg:w-[1054px] md:w-[560px] sm:w-[288px] w-[288px] h-[42px] rounded-[12px] py-[9px] pr-[20px] pl-[40px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // 검색어 입력 처리 💛
          />
          <Image
            src="/assets/ic_search.png"
            alt="Search Icon"
            width={24}
            height={24}
            className="absolute top-1/2 left-4 transform -translate-y-1/2" // 아이콘 위치 조정
          />
        </div>
        {/*커스텀드롭다운 만들기*/}
        <CustomDropdown sortType={sortType} setSortType={setSortType} />
      </div>
      <div className="mt-[24px]">
        {sortedArticles.map((article, index) => (
          <Link key={article.id} href={`/article/${article.id}`} passHref>
            <div className="bg-[#fcfcfc] border-b border-gray_200 mb-[24px]">
              <div className="flex justify-between items-start"> {/*게시글 제목과 이미지를 배치하기 위한 div*/}
                <p className="font-semibold text-[20px] leading-[32px]">{article.title}</p>
                <img src={getImageUrl(article.image)} alt={article.title} className="h-[72px] w-[72px] rounded-[8px] border border-gray_100" />
              </div>
              <div className="flex justify-between items-center mt-[16px] mb-[24px]"> {/*게시글 닉네임,작성일, 좋아요를 배치하기 위한 div*/}
                <div className="flex space-x-2">
                  <Image
                    src="/assets/ic_profile.png"
                    alt="Profile Image Icon"
                    width={24}
                    height={24}
                    className="flex items-center"
                  />
                  <p className="flex items-center text-[14px] text-gray_600">{article.nickname}</p>
                  <p className="flex items-center text-[14px] text-gray_400">
                    {formatDate(article.createdAt)}
                  </p>
                </div>
                <p className="flex items-center text-[16px] text-gray_500">
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
