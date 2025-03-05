// 검색목록 SSR 구현
import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import CustomDropdown from "@/global/components/CustomDropdown";

// SSR 방식으로 서버에서 데이터를 가져옴
export const getServerSideProps = async () => {
  try {
    const res = await fetch('https://five-sprint-mission-be-mission7-kqwz.onrender.com/article');
    const data = await res.json();
    const articles = Array.isArray(data.articles) ? data.articles : [];

    // 좋아요(Heart) 순으로 정렬 후 상위 3개 추출
    const topArticles = [...articles].sort((a, b) => b.Heart - a.Heart).slice(0, 3);

    return {
      props: {
        articles,
        topArticles,
        totalPages: data.totalPages ?? 1,
      },
    };
  } catch (error) {
    console.error("Error fetching articles:", error);
    return {
      props: {
        articles: [],
        topArticles: [],
        totalPages: 1,
      },
    };
  }
};

interface Article {
  id: string;
  title: string;
  image: string | null;
  nickname: string;
  createdAt: string;
  Heart: number;
}

interface FreeboardProps {
  articles: Article[];
  topArticles: Article[];
  totalPages: number;
}

export default function Freeboard({ articles, topArticles, totalPages: initialTotalPages }: FreeboardProps) {
  const router = useRouter();
  const [sortType, setSortType] = useState<"latest" | "heart">("latest");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleTopArticles, setVisibleTopArticles] = useState<Article[]>([]);
  const [fetchedArticles, setFetchedArticles] = useState<Article[]>(articles);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPagesState] = useState(initialTotalPages);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // 베스트 게시글 개수 조정
  useEffect(() => {
    const handleResize = () => {
      let articlesToShow = 3;
      if (window.innerWidth < 768) articlesToShow = 1;
      else if (window.innerWidth < 1024) articlesToShow = 2;

      setVisibleTopArticles(topArticles.slice(0, articlesToShow));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [topArticles]);

  const filteredArticles = fetchedArticles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedArticles = [...filteredArticles].sort((a, b) =>
    sortType === "latest"
      ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      : b.Heart - a.Heart
  );

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).replace(/. /g, '.').slice(0, -1);

  const getImageUrl = (image: string | null) => image?.trim() ? image : "/assets/img_default.png";

  // `useCallback`으로 loadMoreArticles를 최적화
  const loadMoreArticles = useCallback(async () => {
    if (page < totalPages && !loading) {
      setLoading(true);
      const nextPage = page + 1;
      try {
        const res = await fetch(`https://five-sprint-mission-be-mission7-kqwz.onrender.com/article?page=${nextPage}`);
        const data = await res.json();

        if (data?.articles) {
          setFetchedArticles(prev =>
            [...prev, ...data.articles.filter((newArticle: Article) => !prev.some(article => article.id === newArticle.id))]
          );
          setPage(nextPage);
          setTotalPagesState(data.totalPages);
        }
      } catch (error) {
        console.error("Error loading more articles:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [page, totalPages, loading]);

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = scrollContainerRef.current;
      if (scrollContainer) {
        const isBottom = scrollContainer.scrollHeight === scrollContainer.scrollTop + scrollContainer.clientHeight;
        if (isBottom) loadMoreArticles();
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) scrollContainer.addEventListener("scroll", handleScroll);

    return () => {
      if (scrollContainer) scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, [page, totalPages, loading, loadMoreArticles]);


  if (!fetchedArticles || fetchedArticles.length === 0) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className=" lg:w-[1200px] md:w-[696px] sm:w-[343px] w-[343px] mx-auto mt-6 lg:mb-[293px] md:mb-[19px] sm:mb-[91px] mb-[91px]">
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
                  <p className="text-gray_800 font-semibold text-[20px] leading-[32px] w-[calc(100%-120px)] line-clamp-2">
                    {article.title}
                  </p> {/* 제목 (최대 2줄 표시, 초과 시 "..." 처리) */}
                  <Image
                    src={getImageUrl(article.image)}
                    alt={article.title}
                    className="rounded-[8px] border border-gray_200 mt-2"
                    width={72}
                    height={72}
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
      <div className="mt-[24px] lg:mb-[40px] md:mb-[24px] sm:mb-[24px] mb-[24px]">
        {sortedArticles.map((article) => (
          <Link key={article.id} href={`/article/${article.id}`}>
            <div className="bg-[#fcfcfc] border-b border-gray_200 mb-[24px]">
              <div className="flex justify-between items-start"> {/*게시글 제목과 이미지를 배치하기 위한 div*/}
                <p className="text-gray_800 font-semibold text-[20px] leading-[32px]">{article.title}</p>
                <Image
                  src={getImageUrl(article.image)}
                  alt={article.title}
                  className="rounded-[8px] border border-gray_100"
                  width={72}
                  height={72} />
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
