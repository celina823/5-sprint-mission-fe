import arrowLeft from "../Assets/arrowLeft.png";
import arrowRight from "../Assets/arrowRight.png";

export const MainItemsGetPagination = ({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalCount / pageSize); // 전체 페이지 수
  const pageLimit = 5; // 한번에 보여줄 페이지번호 개수
  const startPage = Math.floor((currentPage - 1) / pageLimit) * pageLimit + 1; // 보여줄 페이지 범위의 시작 번호
  const endPage = Math.min(startPage + pageLimit - 1, totalPages); // 보여줄 페이지 범위의 끝 번호

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    onPageChange(newPage); // 부모 컴포넌트로 페이지 변경 요청
  };

  const renderPagination = () => {
    const pages = [];
    // 이전 페이지 버튼
    pages.push(
      <button
        className={`page-nav ${currentPage === 1 ? "disabled" : ""}`} // 첫 페이지에서 비활성화
        id="pageButton"
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <img src={arrowLeft} alt="Previous" />
      </button>
    );

    // 페이지 번호 버튼
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          className={i === currentPage ? "active" : ""}
          id="pageButton"
          key={i}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    // 다음 페이지 버튼
    pages.push(
      <button
        className={`page-nav ${currentPage === totalPages ? "disabled" : ""}`} // 마지막 페이지일 때 비활성화
        id="pageButton"
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <img src={arrowRight} alt="Next" />
      </button>
    );
    return pages;
  };

  return <div id="paginationArea">{renderPagination()}</div>;
};
