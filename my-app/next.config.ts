/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./imageLoader.ts", // 커스텀 로더 파일 지정
  },
};

module.exports = nextConfig;
