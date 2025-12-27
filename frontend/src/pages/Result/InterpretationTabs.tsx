import { useState } from "react";
import { motion } from "framer-motion";
import type { CardData } from "../../components/common/types";

interface Props {
    result: { summary: string; detail: string } | null;
    selectedCards: CardData[];
}

export default function InterpretationTabs({ result, selectedCards }: Props) {
    const [activeTab, setActiveTab] = useState<"summary" | "detail">("summary");

    return (
        <div className="w-full max-w-lg">
            <div className="flex gap-2 mb-6 bg-white/5 p-1 rounded-xl">
                {["summary", "detail"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() =>
                            setActiveTab(tab as "summary" | "detail")
                        }
                        className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${
                            activeTab === tab
                                ? "bg-indigo-600 text-white shadow-lg"
                                : "text-slate-400 hover:text-white"
                        }`}
                    >
                        {tab === "summary" ? "✨ 전체 요약" : "🔍 카드별 해석"}
                    </button>
                ))}
            </div>

            <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full bg-white/5 rounded-2xl p-6 border border-white/10 leading-relaxed text-slate-200 min-h-[200px]"
            >
                {activeTab === "summary" ? (
                    <div>
                        <h3 className="text-xl font-bold text-yellow-400 mb-4">
                            🔮 AI 종합 조언
                        </h3>
                        <p className="mb-4 text-lg whitespace-pre-line leading-8">
                            {result?.summary || "해석을 불러오는 중입니다..."}
                        </p>
                        <div className="mt-6 p-4 bg-indigo-900/30 rounded-lg border border-indigo-500/30">
                            <p className="text-indigo-300 font-bold text-base">
                                💡{" "}
                                {result?.detail ||
                                    "잠시 후 더 상세한 분석이 제공됩니다."}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {selectedCards.map((card, index) => (
                            <div
                                key={card.id}
                                className="border-b border-white/10 pb-4 last:border-0"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-1 rounded bg-slate-800 text-xs text-slate-400">
                                        {index === 0
                                            ? "과거"
                                            : index === 1
                                            ? "현재"
                                            : "미래"}
                                    </span>
                                    <h4 className="font-bold text-lg text-indigo-200">
                                        {card.name}
                                    </h4>
                                </div>
                                <p className="text-sm text-slate-300">
                                    핵심 키워드:{" "}
                                    <span className="text-yellow-400">
                                        {card.keywords.join(", ")}
                                    </span>
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
