// src/utils/imageHandler.ts

// 카드 이미지 경로를 안전하게 반환하는 함수
export const getCardImgPath = (filename: string) => {
    // 혹시 파일명이 없으면 뒷면을 보여줌 (에러 방지)
    if (!filename) return "/cards/back.webp";

    // 나중에 폴더 경로가 바뀌면 여기만 수정하면 됨!
    return `/cards/${filename}`;
};

// 이미지 파일 미리 로딩 (게임 시작 전 깜빡임 방지용)
export const preloadImages = (imageUrls: string[]) => {
    imageUrls.forEach((url) => {
        const img = new Image();
        img.src = url;
    });
};
