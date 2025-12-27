import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TarotCard from "../components/tarot/TarotCard";
import { useCardDraw } from "../hooks/useCardDraw";
import BaseLayout from "../components/layout/BaseLayout";
import type { TarotPageState } from "../components/common/types";
import { getCardImgPath } from "../utils/imageHandler"; // ✅ 유틸 함수 import

export default function Shuffle() {
    const navigate = useNavigate();
    const location = useLocation();

    // 1. location.state를 안전하게 받기
    const state = location.state as TarotPageState;

    // 데이터가 없을 경우 기본값 설정
    const { category, question, spreadType } = state || {
        category: "general",
        question: "질문이 없습니다.",
        spreadType: 3,
    };

    // 2. 커스텀 훅 사용
    const { deck, selectedCards, drawCard } = useCardDraw({
        spreadType: spreadType,
        onComplete: (cards) => {
            navigate("/result", {
                state: {
                    category,
                    question,
                    selectedCards: cards,
                } as TarotPageState,
            });
        },
    });

    return (
        <BaseLayout>
            <div className="flex flex-col items-center py-10 px-4 w-full">
                {/* 상단 안내 메시지 */}
                <div className="text-center mb-8 z-10">
                    <h2 className="text-2xl font-serif font-bold mb-2">
                        {selectedCards.length < spreadType
                            ? "카드를 선택해주세요"
                            : "운명의 메시지를 해석 중입니다..."}
                    </h2>
                    <p className="text-slate-400 text-sm">
                        마음 속으로 질문을 되뇌이며 카드를 뽑아주세요. (
                        {selectedCards.length} / {spreadType})
                    </p>
                </div>

                {/* 3. 선택된 카드들이 놓이는 슬롯 (Upper Area) */}
                <div className="flex gap-4 mb-12 h-40 md:h-56 items-center justify-center w-full max-w-4xl min-h-[160px]">
                    <AnimatePresence>
                        {selectedCards.map((card, index) => (
                            <motion.div
                                key={card.id}
                                layoutId={`card-${card.id}`}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 30,
                                }}
                                className="w-24 md:w-32"
                            >
                                {/* 선택된 카드는 TarotCard 컴포넌트 내부에서 getCardImgPath를 사용하므로 그대로 두면 된다 */}
                                <TarotCard
                                    imageFile={card.image_file}
                                    name={card.name}
                                    isRevealed={true}
                                    isReversed={card.isReversed}
                                />
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-center text-xs mt-2 text-yellow-400 font-bold"
                                >
                                    {index === 0
                                        ? "Past"
                                        : index === 1
                                        ? "Present"
                                        : "Future"}
                                </motion.div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* 4. 덱 (카드 뒷면들이 쫙 깔려있는 영역) */}
                <div className="w-full max-w-6xl pb-10">
                    <motion.div
                        className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-1 sm:gap-2"
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        {deck.map((deckIndex) => (
                            <motion.div
                                key={`deck-${deckIndex}`}
                                layoutId={
                                    selectedCards.length < spreadType
                                        ? `unknown-card-${deckIndex}`
                                        : undefined
                                }
                                whileHover={{ scale: 1.1, y: -10, zIndex: 10 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => drawCard(deckIndex)}
                                className="cursor-pointer"
                            >
                                <div className="w-full aspect-[2/3] rounded bg-indigo-900 border border-white/10 overflow-hidden shadow-sm relative group">
                                    {/* 하드코딩 제거: 유틸 함수 사용: 이미지핸들러 */}
                                    <img
                                        src={getCardImgPath("")}
                                        alt="Card Back"
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </BaseLayout>
    );
}
