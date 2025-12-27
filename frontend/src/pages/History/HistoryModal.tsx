import { motion } from "framer-motion";
import { getTarotImageById } from "../../utils/tarotImageMap";
import tarotData from "../../assets/data/tarot_data.json";
import type { TarotReading } from "./types"; 

interface HistoryModalProps {
    selectedItem: TarotReading; 
    onClose: () => void;
}

const HistoryModal = ({ selectedItem, onClose }: HistoryModalProps) => {
    const getCardInfo = (id: number) => {
        return (tarotData as { id: number; name: string }[]).find(
            (c) => c.id === id
        );
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-900 border border-indigo-500/30 p-8 rounded-3xl max-w-lg w-full max-h-[80vh] overflow-y-auto relative shadow-2xl"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white"
                >
                    ✕ 닫기
                </button>

                <div className="text-center mb-6">
                    <span className="text-xs text-indigo-400 uppercase tracking-widest">
                        My Tarot History
                    </span>
                    <h2 className="text-2xl font-bold mt-2">
                        "{selectedItem.question}"
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        {new Date(selectedItem.createdAt).toLocaleString()}
                    </p>
                </div>

                <div className="flex justify-center flex-wrap gap-4 mb-8 bg-indigo-950/30 p-4 rounded-2xl border border-indigo-500/20">
                    {selectedItem.card_ids
                        ?.split(",")
                        .map((idStr: string, idx: number) => {
                            const cardId = parseInt(idStr.trim(), 10);
                            if (isNaN(cardId)) return null;
                            const cardInfo = getCardInfo(cardId);
                            const isReversed = selectedItem.cards
                                .split(",")[idx]?.includes("역방향");

                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex flex-col items-center"
                                >
                                    <img
                                        src={getTarotImageById(cardId)}
                                        alt={cardInfo?.name}
                                        className="w-24 md:w-32 rounded-xl shadow-2xl border-2 border-indigo-500/50 hover:scale-105 transition-all duration-300"
                                        style={{
                                            transform: isReversed
                                                ? "rotate(180deg)"
                                                : "rotate(0deg)",
                                        }}
                                    />
                                    <div className="mt-3 flex flex-col items-center gap-1.5">
                                        <span className="text-[11px] text-indigo-200 font-bold uppercase">
                                            {cardInfo?.name || `CARD ${cardId}`}
                                        </span>
                                        <span
                                            className={`text-[9px] border px-2 py-0.5 rounded-full font-bold ${
                                                isReversed
                                                    ? "text-red-400 border-red-500/40"
                                                    : "text-blue-400 border-blue-500/40"
                                            }`}
                                        >
                                            {isReversed
                                                ? "🔴 역방향"
                                                : "🔵 정방향"}
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                </div>
                <div className="leading-relaxed text-slate-200 whitespace-pre-line">
                    <p className="text-sm text-yellow-500/80 mb-2">
                        ✨ AI 해석 결과
                    </p>
                    {selectedItem.result}
                </div>
            </motion.div>
        </div>
    );
};

export default HistoryModal;
