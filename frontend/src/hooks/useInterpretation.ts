import { useState, useEffect } from "react";
import type { CardData } from "../components/common/types";
import { fetchTarotReading } from "../api/tarotApi";
import type { TarotReading } from "../pages/History/types";
import { useTarotStore } from "../store/useTarotStore";

const LOADING_MESSAGES = [
    "별들의 배치를 읽습니다...",
    "키워드를 추출합니다...",
    "운명의 흐름을 해석 생성 중입니다...",
];

export const useInterpretation = (
  isReady: boolean,
  question: string,
  selectedCards: CardData[],
  userId?: string,
  email?: string,
) => {
  const { result, setResult } = useTarotStore();
  const [isLoading, setIsLoading] = useState(false); 
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);

  useEffect(() => {
    if (!isReady || selectedCards.length === 0  || result ) {
      setIsLoading(false);
      return;
    }

    let messageIdx = 0;
    const messageTimer = setInterval(() => {
      messageIdx = (messageIdx + 1) % LOADING_MESSAGES.length;
      setLoadingMessage(LOADING_MESSAGES[messageIdx]);
    }, 3000);

    const fetchAI = async () => {
      setIsLoading(true);
      try {
        const data = (await fetchTarotReading(question, selectedCards, userId, email)) as unknown as TarotReading;

        setResult({
          summary: data.result || "해석 결과가 없습니다.",
          detail: data.result 
            ? "AI 마스터의 조언을 참고하여 당신만의 정답을 그려보세요." 
            : "해석 내용을 정리 중입니다. 잠시만 기다려주세요.",
        });
      } catch (error) {
        console.error("타로 해석 실패:", error);

        setResult({
          summary: "오늘 준비된 운명의 에너지가 모두 소진되었습니다.",
          detail: "더 정확한 해석을 위해 정비 중입니다. 24시간 후에 다시 당신의 운명을 마주해 보세요.",
        });
      } finally {
        clearInterval(messageTimer);
        setIsLoading(false);
      }
    };

    fetchAI();

    return () => clearInterval(messageTimer);
  }, [isReady, question, selectedCards, result, setResult, userId, email]);

  return { isLoading, result, loadingMessage };
};
