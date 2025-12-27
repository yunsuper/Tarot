// src/utils/dateFormatter.ts

export const getTodayDate = () => {
    const today = new Date();

    // 한국식 날짜 표기 (YYYY년 MM월 DD일)
    return today.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long", // 예)'수요일'까지 표시
    });
};

// 시간까지 필요할 때 (예: 저장 파일명용)
export const getTimestamp = () => {
    return new Date().toISOString().replace(/[:.]/g, "-");
};
