// src/utils/imageHandler.ts

export const getCardImgPath = (filename: string) => {
    if (!filename) return "/cards/back.webp";

    return `/cards/${filename}`;
};

export const preloadImages = (imageUrls: string[]) => {
    imageUrls.forEach((url) => {
        const img = new Image();
        img.src = url;
    });
};
