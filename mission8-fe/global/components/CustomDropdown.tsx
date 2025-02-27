import { useState } from "react";

interface CustomDropdownProps {
  sortType: "latest" | "heart"; // ✅ 부모 컴포넌트에서 받은 정렬 상태
  setSortType: (value: "latest" | "heart") => void; // ✅ 상태 변경 함수
}

export default function CustomDropdown({ sortType, setSortType }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { value: "latest", label: "최신순" },
    { value: "heart", label: "좋아요순" },
  ] as const;

  const handleSelect = (value: "latest" | "heart") => {
    setSortType(value); // ✅ 부모에서 전달한 setSortType 호출
    setIsOpen(false); // 선택 후 드롭다운 닫기
  };

  return (
    <div className="relative">
      {/* 드롭다운 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:w-[130px] md:w-[130px] sm:w-[42px] h-[42px] border border-gray_200 rounded-[12px] 
        px-[9px] py-[9px] lg:px-[20px] lg:py-[12px] md:px-[20px] md:py-[12px] sm:px-[9px] sm:py-[9px] flex justify-between items-center bg-white"
      >
        <span className="hidden md:block">
          {options.find((opt) => opt.value === sortType)?.label}
        </span>
        {/* 드롭다운 내 아이콘 */}
        <img
          src="/assets/ic_arrow_down.png"
          alt="Arrow Down Icon"
          className={`w-[24px] h-[24px] object-contain hidden md:block transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
        <img
          src="/assets/ic_sort.png"
          alt="Sort Icon"
          className="w-[24px] h-[24px] object-contain md:hidden"
        />
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <ul className="absolute w-[130px] bg-white border border-gray_200 rounded-[12px]
        left-0 md:right-auto md:left-0 sm:right-0 sm:left-auto max-sm:right-0 max-sm:left-auto">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
