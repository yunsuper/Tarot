import { useState, useEffect } from "react";
import tarotData from "../assets/data/tarot_data.json";
import type { CardData } from "../components/common/types";
import { shuffleArray } from "../utils/common";

interface UseCardDrawProps {
    spreadType: number;
    onComplete: (selected: CardData[]) => void;
}

export const useCardDraw = ({ spreadType, onComplete }: UseCardDrawProps) => {
    const [fateParams] = useState<CardData[]>(() => {
        const allCards = [...tarotData] as unknown as CardData[];
        const shuffled = shuffleArray(allCards);

        const selectedWithFate = shuffled.slice(0, spreadType).map((card) => ({
            ...card,
            isReversed: Math.random() < 0.5,
        }));

        return selectedWithFate;
    });

    const [selectedCards, setSelectedCards] = useState<CardData[]>([]);
    const [deck, setDeck] = useState<number[]>(
        Array.from({ length: 78 }, (_, i) => i)
    );

    const drawCard = (deckIndex: number) => {
        if (selectedCards.length >= spreadType) return;

        const nextCard = fateParams[selectedCards.length];

        setDeck((prev) => prev.filter((id) => id !== deckIndex));
        setSelectedCards((prev) => [...prev, nextCard]);
    };

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
