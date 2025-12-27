import tarotData from "../assets/data/tarot_data.json";

interface TarotCard {
    id: number;
    image_file: string;
}

const cards = tarotData as TarotCard[];

/** 카드 id → 실제 카드 이미지 경로 */
export const getTarotImageById = (id: number): string => {
    // 1. 혹시 모를 타입 불일치 방지를 위해 숫자로 변환
    const targetId = Number(id);

    // 2. JSON 데이터에서 해당 ID 찾기
    const card = cards.find((c) => Number(c.id) === targetId);

    // 3. 실제 폴더인 /cards/ 경로로 반환
    if (card && card.image_file) {
        return `/cards/${card.image_file}`;
    }

    // 4. 못 찾았을 경우의 방어 로직 (이것도 /cards/ 폴더 안의 back.png)
    return `/cards/back.png`;
};
