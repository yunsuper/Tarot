import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import TarotCard from "../components/tarot/TarotCard";
import BaseLayout from "../components/layout/BaseLayout"; // 공통 레이아웃
import { toast } from "react-hot-toast";

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // console.log("현재 페이지 상태(state):", location.state);

    // HistoryPage에서 navigate("/", { state: { fromForbidden: true } })로 보낸 경우 (= 비로그인인 경우)
    if (location.state?.fromForbidden) {
      // ✅ setTimeout으로 아주 잠깐의 지연을 줍니다.
      const timer = setTimeout(() => {
        toast.error("내가 본 타로 내역 보기는 로그인이 필요한 서비스입니다.", {
          icon: "🔒",
          duration: 3000,
        });
        // 알람을 띄운 후 상태 초기화 (100을 주어서 시간차 만듬)
        window.history.replaceState({}, document.title);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    // 1. BaseLayout으로 감싸기 (배경, 헤더, 푸터 자동 적용)
    <BaseLayout>
      {/* 1. pt-32: 상단 헤더로부터 카드를 멀리 떨어뜨림 (기존 10 -> 32)
        2. justify-start: 중앙 정렬 대신 위에서부터 여백을 쌓아 세밀하게 조정
      */}
      <div className="flex-1 flex flex-col items-center justify-start pt-20 md:pt-32 pb-20 text-center px-6 min-h-[80vh]">
        {/* 1. 카드: 로고와 너무 멀지 않게 위쪽으로 조정 */}
        <motion.div
          className="w-40 md:w-56 mb-6 md:mb-8"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <TarotCard imageFile="m00.webp" name="Welcome Tarot" />
        </motion.div>

        {/* 설명 텍스트 */}
        <div className="mb-16 md:mb-24">
          <p className="text-white text-2xl md:text-3xl font-bold mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            당신의 운명을 마주하세요.
          </p>
          <p className="text-slate-400 text-sm md:text-base tracking-wide">
            AI 타로가 당신의 과거, 현재, 미래를 읽어드립니다.
          </p>
        </div>

        {/* 버튼 */}
        <button
          onClick={() => navigate("/question")}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 px-12 rounded-full shadow-lg hover:shadow-indigo-500/50 transition-all transform hover:scale-105 active:scale-95 text-lg"
        >
          운세 보기 시작
        </button>
      </div>
    </BaseLayout>
  );
}
