
interface ImageLoaderProps {
  src: string; // Explicitly define src as a string
}

const imageLoader = ({ src }: ImageLoaderProps) => {
  return src; // 모든 도메인 허용
};

export default imageLoader;
