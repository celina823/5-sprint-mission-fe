import { useState, useEffect, useRef, useCallback } from "react";

interface Article {
  id: string;
  title: string;
  image: string | null;
  nickname: string;
  createdAt: string;
  Heart: number;
}

const API_URL = "https://five-sprint-mission-be-mission7-kqwz.onrender.com/article";

const useInfiniteScroll = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  // 데이터를 불러오는 함수
  const fetchArticles = useCallback(async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}?page=${page}&limit=4`);
      const data = await res.json();

      if (data.articles.length > 0) {
        setArticles((prev) => [...prev, ...data.articles]);
        setPage((prev) => prev + 1);
      } else {
        setHasMore(false); // 더 이상 불러올 데이터가 없으면 hasMore = false
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading]);

  console.log("로딩 상태:", loading);

  // 스크롤이 마지막 요소에 도달하면 fetchArticles 실행
  useEffect(() => {
    if (!observerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchArticles();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [fetchArticles, hasMore]);

  return { articles, observerRef, loading };
};

export default useInfiniteScroll;
