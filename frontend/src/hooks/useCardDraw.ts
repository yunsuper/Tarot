import { useState, useEffect } from "react";
import tarotData from "../assets/data/tarot_data.json";
import type { CardData } from "../components/common/types";
import { shuffleArray } from "../utils/common";

interface UseCardDrawProps {
    spreadType: number;
    onComplete: (selected: CardData[]) => void;
}

export const useCardDraw = ({ spreadType, onComplete }: UseCardDrawProps) => {
    // 1. 운명 결정 (Lazy Init)
    const [fateParams] = useState<CardData[]>(() => {
        // 전체 카드를 가져와서 섞습니다.
        const allCards = [...tarotData] as unknown as CardData[];
        const shuffled = shuffleArray(allCards);

        // 뽑을 개수만큼 자른 뒤, 각 카드에 50% 확률로 역방향(isReversed)을 부여합니다.
        const selectedWithFate = shuffled.slice(0, spreadType).map((card) => ({
            ...card,
            isReversed: Math.random() < 0.5,
        }));

        // ✅ 핵심: 새로 생성한 selectedWithFate를 반환해야 합니다.
        return selectedWithFate;
    });

    // 2. 상태 관리
    const [selectedCards, setSelectedCards] = useState<CardData[]>([]);
    const [deck, setDeck] = useState<number[]>(
        Array.from({ length: 78 }, (_, i) => i)
    );

    // 3. 카드 뽑기 핸들러
    const drawCard = (deckIndex: number) => {
        if (selectedCards.length >= spreadType) return;

        // 미리 정해진 운명(fateParams)에서 카드를 순서대로 꺼내옵니다.
        const nextCard = fateParams[selectedCards.length];

        setDeck((prev) => prev.filter((id) => id !== deckIndex));
        setSelectedCards((prev) => [...prev, nextCard]);
    };

    // 4. 완료 체크 (다 뽑으면 1.5초 뒤 결과창 이동)
    useEffect(() => {
        if (selectedCards.length === spreadType) {
            const timer = setTimeout(() => {
                onComplete(selectedCards);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [selectedCards, spreadType, onComplete]);

    return { deck, selectedCards, drawCard, fateParams };
};
