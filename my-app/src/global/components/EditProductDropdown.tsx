import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

interface ProductDropdownProps {
  itemId: string;
  onDelete: () => void;
}

export const ProductDropdown = ({ itemId, onDelete }: ProductDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)}>
        <Image
          src="/assets/ic_kebab.png"
          alt="Menu"
          width={24}
          height={24}
          style={{ cursor: "pointer" }}
        />
      </button>
      {isOpen && (
        <ul className="absolute right-0 w-[102px] sm:w-[102px] md:w-[102px] lg:w-[139px] flex flex-col items-center border border-gray-300 rounded-[8px] bg-white">
          <li
            className="flex justify-center w-full cursor-pointer font-normal text-[16px] leading-[26px] text-gray-500 border-b border-gray-300 py-[8px] hover:bg-gray-100"
            onClick={() => router.push(`/items/edit/${itemId}`)}
          >
            수정하기
          </li>
          <li
            className="flex justify-center w-full cursor-pointer font-normal text-[16px] leading-[26px]  text-gray-500 py-[8px] hover:bg-gray-100"
            onClick={onDelete}
          >
            삭제하기
          </li>
        </ul>
      )}
    </div>
  );
};
