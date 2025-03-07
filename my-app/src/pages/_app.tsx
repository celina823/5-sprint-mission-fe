import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/router";
import Header from "@/global/header/Header";
import Footer from "@/global/footer/Footer";

const queryClient = new QueryClient(); // QueryClient 인스턴스 생성

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const hiddenPaths = ["/signin", "/signup"]
  return (
    <>
      <QueryClientProvider client={queryClient}>
        {!hiddenPaths.includes(router.pathname) && <Header />}
        <Component {...pageProps} />
        {!hiddenPaths.includes(router.pathname) && <Footer />}
      </QueryClientProvider>
    </>
  );
}