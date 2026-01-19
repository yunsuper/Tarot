import { useLocation, useNavigate } from "react-router-dom";
import { useInterpretation } from "../../hooks/useInterpretation";
import { useShare } from "../../hooks/useShare";
import BaseLayout from "../../components/layout/BaseLayout";
import { getTodayDate } from "../../utils/dateFormatter";
import type { TarotPageState } from "../../components/common/types";
import { useTarotStore } from "../../store/useTarotStore";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import TarotSupport from "../../components/common/TarotSupport";

import ResultLoading from "./ResultLoading";
import CardResultList from "./CardResultList";
import InterpretationTabs from "./InterpretationTabs";

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const { result: storedResult, clearSession } = useTarotStore();
  const state = location.state as TarotPageState;
  const { category = "general", question = "질문이 없습니다.", selectedCards = [] } = state || {};

  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);

  useEffect(() => {
    if (storedResult) {
      clearSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
        setUserEmail(session.user.email);
      }
      setIsSessionLoaded(true);
    };
    getSession();
  }, []);

  const { isLoading, result } = useInterpretation(isSessionLoaded, question, selectedCards, userId, userEmail);

  const { shareResult } = useShare();

  const handleRetry = () => {
    clearSession();
    navigate("/");
  };

  if (isLoading || !isSessionLoaded) return <ResultLoading />;

  return (
    <BaseLayout>
      <div className="w-full max-w-4xl mx-auto py-8 px-4 flex flex-col items-center">
        <div className="text-center mb-10">
          <p className="text-slate-400 text-sm mb-2 tracking-widest uppercase opacity-80">📅 {getTodayDate()}</p>
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold mb-3 uppercase">
            {category} Luck
          </span>
          <h1 className="text-2xl md:text-3xl font-bold break-keep leading-tight">"{question}"</h1>
        </div>

        <CardResultList cards={selectedCards} />
        <InterpretationTabs result={result} selectedCards={selectedCards} />

        <div className="mt-10 flex flex-col items-center w-full gap-4">
          <div className="flex gap-4 w-full max-w-lg">
            <button
              onClick={handleRetry}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-4 rounded-xl font-bold transition-colors"
            >
              다시 하기
            </button>
            <button
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold shadow-lg transition-transform hover:scale-105"
              onClick={() => result && shareResult(result.summary, result.detail)}
            >
              결과 공유하기 🔗
            </button>
          </div>

          <TarotSupport />

          <button
            onClick={() => navigate("/history")}
            className="w-full max-w-xs bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 py-3 rounded-xl font-bold border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)] transition-all mb-10"
          >
            🔮 내가 본 타로 내역 보기
          </button>
        </div>
      </div>
    </BaseLayout>
  );
}
