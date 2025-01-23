import { useState } from "react";

const unformatPrice = (value) => {
  return value.replace(/,/g, ""); // 쉼표를 제거하고 숫자로 반환
};

export function useValidation() {
  const [errors, setErrors] = useState({});

  const validateProductName = (productName) => {
    if (productName.length < 1 || productName.length > 10) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        productName: "10자 이내로 입력해주세요",
      }));
    } else {
      setErrors((prevErrors) => {
        const { productName, ...rest } = prevErrors;
        return rest;
      });
    }
  };

  const validateProductDescription = (productDescription) => {
    if (productDescription.length < 10 || productDescription.length > 100) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        productDescription: "10자 이상 입력해주세요",
      }));
    } else {
      setErrors((prevErrors) => {
        const { productDescription, ...rest } = prevErrors;
        return rest;
      });
    }
  };

  const validateProductPrice = (productPrice) => {
    const priceWithoutComma = unformatPrice(productPrice); // 쉼표를 제거한 가격
    if (!/^\d+$/.test(priceWithoutComma) || priceWithoutComma.length < 1) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        productPrice: "숫자로 입력해주세요",
      }));
    } else {
      setErrors((prevErrors) => {
        const { productPrice, ...rest } = prevErrors;
        return rest;
      });
    }
  };

  const validateProductTag = (productTag) => {
    if (productTag.length > 5) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        productTag: "5글자 이내로 입력해주세요",
      }));
    } else {
      setErrors((prevErrors) => {
        const { productTag, ...rest } = prevErrors;
        return rest;
      });
    }
  };

  const validate = (
    productName,
    productDescription,
    productPrice,
    productTag
  ) => {
    validateProductName(productName);
    validateProductDescription(productDescription);
    validateProductPrice(productPrice);
    validateProductTag(productTag);
  };

  return {
    errors,
    validate,
  };
}
