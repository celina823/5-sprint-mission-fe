import React, { useState } from "react";
import Image from "next/image";

interface EditDropdownMenuProps {
  commentId: number;
  onEdit: (commentId: number) => void;
  onDelete: (commentId: number) => void;
}

export const EditDropdownMenu: React.FC<EditDropdownMenuProps> = ({ commentId, onEdit, onDelete }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div>
      <Image
        src="/assets/ic_kebab.png" // Add your kebab menu icon
        alt="Kebab Menu"
        width={24}
        height={24}
        onClick={toggleDropdown}
        style={{ cursor: "pointer" }}
      />

      {showDropdown && (
        <div className="w-[102px] sm:w-[102px] md:w-[102px] lg:w-[139px] flex flex-col border border-gray-300 rounded-[8px]">
          <button onClick={() => onEdit(commentId)}
            className="font-normal text-[16px] leading-[26px] text-gray-500 border-b border-gray-300 py-[8px]">수정하기</button>
          <button onClick={() => onDelete(commentId)}
            className="font-normal text-[16px] leading-[26px]  text-gray-500 py-[8px]">삭제하기</button>
        </div>
      )}
    </div>
  );
};

