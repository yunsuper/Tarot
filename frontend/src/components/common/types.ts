// 카드 데이터 타입
export interface CardData {
    id: number;
    name: string;
    image_file: string;
    keywords: string[];
    type?: string; // major | minor
    name_kr?: string;
    suit?: string;
    isReversed?: boolean;
}

// 카테고리 타입 (문자열 오타 방지)
export type TarotCategory = "love" | "work" | "money" | "general";

// AI 해석 결과 타입
export interface InterpretationResult {
    summary: string;
    detail: string;
}

// 페이지 이동 시 넘겨주는 데이터 타입
export interface TarotPageState {
    category: TarotCategory; // string 대신 구체적인 타입 사용
    question: string;
    spreadType: number;
    selectedCards?: CardData[]; // Result 페이지에서만 존재
}