// src/utils/dateFormatter.ts

export const getTodayDate = () => {
    const today = new Date();

    return today.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long", 
    });
};

export const getTimestamp = () => {
    return new Date().toISOString().replace(/[:.]/g, "-");
};
