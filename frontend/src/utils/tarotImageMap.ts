import tarotData from "../assets/data/tarot_data.json";

interface TarotCard {
    id: number;
    image_file: string;
}

const cards = tarotData as TarotCard[];

export const getTarotImageById = (id: number): string => {
    const targetId = Number(id);

    const card = cards.find((c) => Number(c.id) === targetId);

    if (card && card.image_file) {
        return `/cards/${card.image_file}`;
    }

    return `/cards/back.webp`;
};
