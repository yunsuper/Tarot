import { client } from "./axiosConfig";
import type { CardData, InterpretationResult } from "../components/common/types";

export const fetchTarotReading = async (
  question: string,
  selectedCards: CardData[],
  userId?: string,
  email?: string,
): Promise<InterpretationResult> => {
  const formattedCards = selectedCards.map((c) => ({
    id: c.id,
    name: c.name,
    isReversed: c.isReversed ?? false,
  }));

  try {
    const response = await client.post<InterpretationResult>("/reading", {
      question,
      cards: formattedCards,
      userId,
      email,
    });

    return response.data;
  } catch (error) {
    console.error("API 요청 에러:", error);
    return {
      summary: "서버 연결에 실패했습니다.",
      detail: "백엔드 서버가 켜져 있는지 확인해주세요.",
    };
  }
};
