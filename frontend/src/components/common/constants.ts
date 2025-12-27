import type{ TarotCategory } from "./types";

// 카테고리 목록 (Question 페이지 등에서 사용)
export const CATEGORIES: { id: TarotCategory; label: string; icon: string }[] =
    [
        { id: "love", label: "연애", icon: "💕" },
        { id: "work", label: "진로", icon: "💼" },
        { id: "money", label: "금전", icon: "💰" },
        { id: "general", label: "총운", icon: "🔮" },
    ];

// 스프레드 타입
export const SPREAD_TYPES = {
    ONE_CARD: 1,
    THREE_CARD: 3,
};
