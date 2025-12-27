import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BaseLayout from "../../components/layout/BaseLayout";

// 컴포넌트 외부에서 메시지 관리 (의존성 에러 해결)
const LOADING_MESSAGES = [
  "카드의 신비로운 에너지를 모으고 있습니다...",
  "Gemini가 당신의 운명을 깊게 들여다보는 중입니다...",
  "거의 다 되었습니다! 조언을 정리하고 있어요...",
];

export default function ResultLoading() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // 3초마다 인덱스 순환
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <BaseLayout>
      <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-[60vh]">
        {/* 1. 중앙 수정구슬 애니메이션 */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl mb-8"
        >
          🔮
        </motion.div>

        {/* 2. 메인 타이틀 */}
        <h2 className="text-2xl font-serif font-bold mb-4 text-center text-white">운명을 해석하고 있습니다...</h2>

        {/* 3. 프로그레스 바 (게이지 차오르는 효과) */}
        <div className="w-64 h-2 bg-slate-700 rounded-full overflow-hidden mb-6">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 10, ease: "linear" }}
          />
        </div>

        {/* 4. 순차적 메시지 송출 애니메이션 */}
        <div className="h-6 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-slate-400 text-sm font-medium text-center"
            >
              {LOADING_MESSAGES[index]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </BaseLayout>
  );
}
