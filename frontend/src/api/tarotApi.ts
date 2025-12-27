import { client } from "./axiosConfig";
import type { CardData, InterpretationResult } from "../components/common/types";

// userId 파라미터 추가
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

  console.log("실제 서버로 요청 보냄:", {
    question,
    cards: formattedCards,
    userId: userId || "Guest",
    email: email || "Guest", // 로그 확인
  });

  try {
    const response = await client.post<InterpretationResult>("/reading", {
      question,
      cards: formattedCards,
      userId, // 백엔드 바디(Body)에 userId 포함
      email,
    });

    console.log("서버 응답 도착:", response.data);
    return response.data;
  } catch (error) {
    console.error("API 요청 에러:", error);
    return {
      summary: "서버 연결에 실패했습니다.",
      detail: "백엔드 서버가 켜져 있는지 확인해주세요.",
    };
  }
};
