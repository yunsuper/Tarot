import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BaseLayout from "../components/layout/BaseLayout";
import { CATEGORIES } from "../components/common/constants";

export default function Question() {
    const navigate = useNavigate();
    const [category, setCategory] = useState<string>(CATEGORIES[0].id);
    const [question, setQuestion] = useState("");
    const [spreadType, setSpreadType] = useState<"1" | "3">("3");

    const isValid = question.length >= 3;

    const handleNext = () => {
        if (!isValid) return;

        navigate("/shuffle", {
            state: {
                category,
                question,
                spreadType: parseInt(spreadType),
            },
        });
    };

    return (
        <BaseLayout>
            <div className="w-full flex flex-col items-center py-8 px-6">
                <div className="w-full max-w-md flex justify-start mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                    >
                        &larr; 이전으로
                    </button>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md space-y-8"
                >
                    <section>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            1. 주제를 선택해주세요
                        </h2>
                        <div className="grid grid-cols-4 gap-2">
                            {CATEGORIES.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setCategory(item.id)}
                                    className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all
                                    ${
                                        category === item.id
                                            ? "bg-indigo-600 ring-2 ring-yellow-400 text-white shadow-lg transform scale-105"
                                            : "bg-white/10 hover:bg-white/20 text-slate-300"
                                    }`}
                                >
                                    <span className="text-2xl">
                                        {item.icon}
                                    </span>
                                    <span className="text-sm font-medium">
                                        {item.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4">
                            2. 무엇이 궁금하신가요?
                        </h2>
                        <div className="relative">
                            <textarea
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="예) 짝사랑하는 그 사람과 잘 될 수 있을까요?"
                                className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none placeholder:text-slate-500"
                                maxLength={150}
                            />
                            <div className="absolute bottom-3 right-3 text-sm text-slate-500">
                                {question.length}/150
                            </div>
                        </div>
                        {!isValid && question.length > 0 && (
                            <p className="text-red-400 text-sm mt-2 ml-1">
                                질문을 3글자 이상 입력해주세요.
                            </p>
                        )}
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4">
                            3. 카드 선택 방식
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setSpreadType("1")}
                                className={`p-4 rounded-xl border-2 transition-all text-left relative overflow-hidden
                                ${
                                    spreadType === "1"
                                        ? "border-indigo-500 bg-indigo-500/20 shadow-md"
                                        : "border-white/10 bg-white/5 opacity-60 hover:opacity-80"
                                }`}
                            >
                                <div className="font-bold text-lg mb-1 relative z-10">
                                    ☝️ 원카드
                                </div>
                                <div className="text-xs text-slate-300 relative z-10">
                                    간단하고 명쾌한 조언
                                </div>
                            </button>

                            <button
                                onClick={() => setSpreadType("3")}
                                className={`p-4 rounded-xl border-2 transition-all text-left relative overflow-hidden
                                ${
                                    spreadType === "3"
                                        ? "border-indigo-500 bg-indigo-500/20 shadow-md"
                                        : "border-white/10 bg-white/5 opacity-60 hover:opacity-80"
                                }`}
                            >
                                <div className="font-bold text-lg mb-1 relative z-10">
                                    🖐️ 3장 보기
                                </div>
                                <div className="text-xs text-slate-300 relative z-10">
                                    과거/현재/미래 심층 분석
                                </div>
                            </button>
                        </div>
                    </section>

                    <button
                        onClick={handleNext}
                        disabled={!isValid}
                        className={`w-full py-4 rounded-full font-bold text-lg shadow-lg transition-all mt-8 mb-10
                        ${
                            isValid
                                ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-white hover:scale-105 hover:shadow-yellow-500/30 cursor-pointer"
                                : "bg-slate-700 text-slate-400 cursor-not-allowed"
                        }`}
                    >
                        타로 리딩 시작하기 ✨
                    </button>
                </motion.div>
            </div>
        </BaseLayout>
    );
}
