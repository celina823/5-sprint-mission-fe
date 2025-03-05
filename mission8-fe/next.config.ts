import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/:path*', // 클라이언트에서 '/api'로 요청할 때
        destination: 'https://five-sprint-mission-be-mission7-kqwz.onrender.com/:path*', // 실제 API 서버 주소로 리다이렉트
      },
    ];
  },
  images: {
    domains: ['cdn.pixabay.com', 'encrypted-tbn3.gstatic.com'], // 허용할 도메인 추가
  },
};

export default nextConfig;
