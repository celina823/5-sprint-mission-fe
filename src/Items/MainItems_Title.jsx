import React, { useState, useEffect } from "react";
import IconSearch from "../Assets/Ic_Search.png";
import { useNavigate } from "react-router-dom";

export function MainItemsTitle() {
  const [keyword, setKeyword] = useState(""); // 검색어를 상태로 관리
  const [searchKeyword, setSearchKeyword] = useState(""); //엔터키로 설정될 검색어 상태 관리
  const navigate = useNavigate(); //페이지 이동을 위함

  /*input값을 api 요청하는 데에 필요함*/
  // input 값 변경 핸들러
  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setSearchKeyword(keyword);
    }
  };
  /*여기까지!*/

  const handleSignupSellProductBtn = () => {
    navigate("/registration"); //상품 등록페이지 /registration로 이동
  };

  return (
    <div className="titleLineSellProduct">
      <div className="titleSellProduct">판매 중인 상품</div>
      <div className="titleSearch">
        <img className="SearchIconImg" src={IconSearch} alt="Search Icon" />
        <input
          className="SearchSellProductInput"
          type="text"
          value={keyword}
          onChange={handleKeywordChange}
          onKeyDown={handleKeyDown}
          placeholder="검색할 상품을 입력해주세요"
        ></input>
      </div>
      <button
        className="signupSellProductBtn"
        onClick={handleSignupSellProductBtn}
      >
        상품 등록하기
      </button>
      <select className="dropdownSellProduct">
        <option value="recent">최신순</option>
        <option value="favorite">좋아요순</option>
      </select>
    </div>
  );
}
