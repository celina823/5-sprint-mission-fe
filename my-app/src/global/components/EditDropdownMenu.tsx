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
        <div className="dropdown-menu">
          <button onClick={() => onEdit(commentId)}>수정</button>
          <button onClick={() => onDelete(commentId)}>삭제</button>
        </div>
      )}
    </div>
  );
};

