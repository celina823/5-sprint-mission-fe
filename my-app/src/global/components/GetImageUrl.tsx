// 상품 이미지 깨지는거 처리
export const getImageUrl = (image: string | null | undefined) => {
  if (!image || image.trim() === "" || image.startsWith("https://example.com")) {
    return "/assets/img_default.png"; // 기본 이미지 경로
  }
  return image; // 유효한 이미지 URL인 경우 원본 이미지 사용
};

// 프로필 이미지 깨지는거 처리
export const getProfileImgUrl = (image: string | null | undefined) => {
  if (!image || image.trim() === "" || image.startsWith("https://example.com")) {
    return "/assets/ic_profile.png"; // 기본 이미지 경로
  }
  return image; // 유효한 이미지 URL인 경우 원본 이미지 사용
};
