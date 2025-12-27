import { create } from "zustand";
import type {
    CardData,
    InterpretationResult,
} from "../components/common/types";

interface TarotState {
    question: string;
    category: string;
    selectedCards: CardData[];
    result: InterpretationResult | null;
    // 액션(함수)들
    setSession: (q: string, cat: string, cards: CardData[]) => void;
    setResult: (res: InterpretationResult) => void;
    clearSession: () => void;
}

export const useTarotStore = create<TarotState>((set) => ({
    question: "",
    category: "",
    selectedCards: [],
    result: null,

    setSession: (q, cat, cards) =>
        set({
            question: q,
            category: cat,
            selectedCards: cards,
            result: null, // 새로운 세션 시작 시 이전 결과 초기화
        }),
    setResult: (res) => set({ result: res }),
    clearSession: () =>
        set({ question: "", category: "", selectedCards: [], result: null }),
}));
