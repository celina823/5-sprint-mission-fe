import { useState } from "react";
import axios from "axios";
import { useValidation } from "./useValidation"; // 커스텀 훅 불러오기
import "./Registration.css";
import IcX from "../Assets/Ic_X.png";

const API_URL = "https://five-sprint-mission-be-1.onrender.com";

export function MainRegistration() {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productTag, setProductTag] = useState("");
  const [tags, setTags] = useState([]); // 칩 형태로 보여줄 태그 상태
  const [touched, setTouched] = useState({
    productName: false,
    productDescription: false,
    productPrice: false,
    productTag: false,
  }); // 입력 필드가 터치되었는지

  const { errors, validate } = useValidation(); // 유효성검사 훅 사용

  const isFormValid = Object.keys(errors).length === 0; // 유효성 검사

  // 가격에 쉼표를 자동으로 추가하는 함수
  const formatPrice = (value) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // 1000단위로 쉼표 추가
  };

  // 숫자에 쉼표가 추가된 가격을 다시 숫자로 변환하는 함수
  const unformatPrice = (value) => {
    return value.replace(/,/g, ""); // 쉼표를 제거하고 숫자로 반환
  };

  // 가격 변경 핸들러
  const handlePriceChange = (e) => {
    let value = e.target.value;
    console.log("입력된 판매가격 확인용", value);
    // 숫자만 남기고, 쉼표가 들어가게 함
    value = unformatPrice(value); // 쉼표 제거
    value = formatPrice(value); // 쉼표 추가

    setProductPrice(value); // 상태 업데이트
    validate(productName, productDescription, value, productTag); // 가격에 대한 유효성 검사 추가
  };

  // 태그 입력 변경 핸들러
  const handleTagChange = (e) => {
    setProductTag(e.target.value); // 입력된 태그 상태 업데이트
    validate(productName, productDescription, productPrice, e.target.value); // 태그에 대한 유효성 검사
  };

  // 태그 추가 핸들러
  const handleAddTag = (e) => {
    if (e.key === "Enter" && productTag.trim() !== "") {
      const tagWithHash = "#" + productTag.trim(); // 입력된 태그 앞에 '#'을 추가
      if (!tags.includes(tagWithHash)) {
        setTags([...tags, tagWithHash]);
      }
      setProductTag(""); // 태그 입력 필드 초기화
      validate(productName, productDescription, productPrice, ""); // 태그 입력 후 유효성 검사 초기화
    }
  };

  // 태그 제거 핸들러
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // 입력 필드 터치 상태 변경 핸들러
  const handleBlur = (field) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  // 폼 제출 핸들러
  const handleRegistration = async (e) => {
    e.preventDefault();

    // 유효성 검사 실행
    validate(productName, productDescription, productPrice, productTag);

    // 유효성 검사를 통과하지 않으면 리턴
    if (!isFormValid) return;

    // 쉼표 제거 후 서버로 전송할 데이터 객체 준비
    const formattedPrice = unformatPrice(productPrice); // 쉼표를 제거한 가격

    // 서버로 전송할 데이터 객체
    const productData = {
      name: productName,
      description: productDescription,
      price: formattedPrice, // 쉼표를 제거한 숫자 값
      tags: tags.map((tag) => tag.replace(/^#/, "")),
    };

    console.log("상품 등록 데이터 확인용", productData);

    try {
      // 서버로 POST 요청 보내기
      const response = await axios.post(`${API_URL}/product`, productData);
      console.log("상품 등록 성공", response.data);
      // 등록 후 초기화
      setProductName("");
      setProductDescription("");
      setProductPrice("");
      setProductTag("");
      setTags([]);
      setTouched({
        productName: false,
        productDescription: false,
        productPrice: false,
        productTag: false,
      });
    } catch (error) {
      console.error("상품 등록 실패", error);
    }
  };

  return (
    <div id="inputArea">
      <div id="titleLineProductRegistration">
        <div id="titleRegistration">상품 등록하기</div>
        <button
          id="buttonRegistration"
          onClick={handleRegistration}
          disabled={!isFormValid}
          style={{
            backgroundColor: isFormValid ? "#3692ff" : "#9ca3af", // 활성화 시 파란색, 비활성화 시 회색
          }}
        >
          등록
        </button>
      </div>

      {/* 상품명 입력 필드 */}
      <div id="inputContainer_ProductName" className="inputContainer">
        <label htmlFor="inputProductName">상품명</label>
        <input
          id="inputProductName"
          className={`inputDisplay ${
            errors.productName && touched.productName ? "inputError" : ""
          }`}
          type="text"
          placeholder="상품명을 입력해주세요"
          value={productName}
          onChange={(e) => {
            setProductName(e.target.value);
            validate(
              e.target.value,
              productDescription,
              productPrice,
              productTag
            ); // 상품명 유효성 검사
          }}
          onBlur={() => handleBlur("productName")} // 포커스를 잃을 때 터치 상태 업데이트
        />
        {errors.productName && touched.productName && (
          <div className="error-message">{errors.productName}</div>
        )}
      </div>

      {/* 상품 소개 입력 필드 */}
      <div id="inputContainer_Description" className="inputContainer">
        <label htmlFor="inputProductDescription">상품 소개</label>
        <input
          id="inputProductDescription"
          className={`inputDisplay ${
            errors.productDescription && touched.productDescription
              ? "inputError"
              : ""
          }`}
          type="text"
          placeholder="상품 소개를 입력해주세요"
          value={productDescription}
          onChange={(e) => {
            setProductDescription(e.target.value);
            validate(productName, e.target.value, productPrice, productTag); // 상품 소개 유효성 검사
          }}
          onBlur={() => handleBlur("productDescription")} // 포커스를 잃을 때 터치 상태 업데이트
        />
        {errors.productDescription && touched.productDescription && (
          <div className="error-message">{errors.productDescription}</div>
        )}
      </div>

      {/* 판매 가격 입력 필드 */}
      <div id="inputContainer_Price" className="inputContainer">
        <label htmlFor="inputProductPrice">판매가격</label>
        <input
          id="inputProductPrice"
          className={`inputDisplay ${
            errors.productPrice && touched.productPrice ? "inputError" : ""
          }`}
          type="text"
          placeholder="판매가격을 입력해주세요"
          value={productPrice}
          onChange={handlePriceChange}
          onBlur={() => handleBlur("productPrice")} // 포커스를 잃을 때 터치 상태 업데이트
        />
        {errors.productPrice && touched.productPrice && (
          <div className="error-message">{errors.productPrice}</div>
        )}
      </div>

      {/* 태그 입력 필드 */}
      <div id="inputContainer_Tag" className="inputContainer">
        <label htmlFor="inputProductTag">태그</label>
        <input
          id="inputProductTag"
          className={`inputDisplay ${
            errors.productTag && touched.productTag ? "inputError" : ""
          }`}
          type="text"
          placeholder="태그를 입력해주세요"
          value={productTag}
          onChange={handleTagChange}
          onKeyDown={handleAddTag}
          onBlur={() => handleBlur("productTag")} // 포커스를 잃을 때 터치 상태 업데이트
        />
        {errors.productTag && touched.productTag && (
          <div className="error-message">{errors.productTag}</div>
        )}
        <div className="tags-container">
          {tags.map((tag, index) => (
            <span key={index} className="tag-chip">
              {tag}{" "}
              <button
                type="button"
                className="removeButton"
                onClick={() => handleRemoveTag(tag)}
              >
                <img className="RemoveIcon" src={IcX} alt="remove tag" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
