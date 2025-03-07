import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-800 h-[160px] ">
      <div className="flex items-center justify-between pt-[32px] lg:w-[1120px] md:w-[696px] mx-auto">
        <p className="text-gray-400 font-normal text-[16px] leading-[19.09px] tracking-[0%] text-center">©codeit - 2024</p>
        <div className="flex gap-[30px] font-normal text-[16px] leading-[19.09px] tracking-[0%] text-center">
          <p className="text-gray-200">Privacy Policy</p>
          <p className="text-gray-200">FAQ</p>
        </div>
        <div className="flex gap-3">
          <Link href={"https://www.facebook.com/"}>
            <Image
              src="/assets/ic_facebook.png"
              alt="facebook icon"
              width={20}
              height={20}
            />
          </Link>
          <Link href={"https://x.com/"}>
            <Image
              src="/assets/ic_twitter.png"
              alt="ic_twitter icon"
              width={20}
              height={20}
            />
          </Link>
          <Link href={"https://www.youtube.com/"}>
            <Image
              src="/assets/ic_youtube.png"
              alt="youtube icon"
              width={20}
              height={20}
            />
          </Link>
          <Link href={"https://www.instagram.com"}>
            <Image
              src="/assets/ic_instagram.png"
              alt="instagram icon"
              width={20}
              height={20}
            />
          </Link>
        </div>
      </div>
    </footer>
  )
}