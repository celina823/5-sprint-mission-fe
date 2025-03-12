import React from "react";
import Image from "next/image";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const ProductPagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pageLimit = 5;
  const startPage = Math.floor((currentPage - 1) / pageLimit) * pageLimit + 1;
  const endPage = Math.min(startPage + pageLimit - 1, totalPages);

  return (
    <div id="paginationArea">
      {/* ◀️ 이전 버튼 */}
      <button
        className={`page-nav ${currentPage === 1 ? "disabled" : ""}`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <Image
          src="/assets/arrowLeft.png"
          alt="previous button"
          width={24}
          height={24}
        />
      </button>

      {/* 1~5, 6~10 ... 페이지 버튼 */}
      {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((pageNum) => (
        <button
          key={pageNum}
          className={pageNum === currentPage ? "active" : ""}
          onClick={() => onPageChange(pageNum)}
        >
          {pageNum}
        </button>
      ))}

      {/* ▶️ 다음 버튼 */}
      <button
        className={`page-nav ${currentPage === totalPages ? "disabled" : ""}`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <Image
          src="/assets/arrowRight.png"
          alt="next button"
          width={24}
          height={24}
        />
      </button>
    </div>
  );
};
