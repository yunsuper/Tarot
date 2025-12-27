import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import HistoryListItem from "./HistoryListItem.tsx";
import HistoryModal from "./HistoryModal";
import type { TarotReading } from "./types";
import { supabase } from "../../utils/supabaseClient"; 

const HistoryPage = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState<TarotReading[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<TarotReading | null>(null);

    useEffect(() => {
      const fetchHistory = async () => {
        try {
          // 1. Supabase에서 현재 로그인한 유저 ID 가져오기
          const {
            data: { session },
          } = await supabase.auth.getSession();

          // 2. 비로그인 유저 처리
          if (!session?.user) {
            // 알람 없이 즉시 메인으로 이동하되, 'fromForbidden'이라는 꼬리표를 붙여줍니다.
            navigate("/", { state: { fromForbidden: true } });
            return;
          }

          const userId = session.user.id;

          // 3. userId를 쿼리 스트링으로 전달 (백엔드 @Query('userId')와 매칭)
          const response = await axios.get(
            `http://localhost:3000/history`,
            { params: { userId } }, // ?userId=UUID 형태로 전송됨
          );

          setHistory(response.data);
        } catch {
          toast.error("기록을 불러오는 중 오류가 발생했습니다.");
        } finally {
          setLoading(false);
        }
      };
      fetchHistory();
    }, [navigate]);

    if (loading)
        return <div className="text-white text-center mt-20">로딩 중...</div>;

    return (
      <div className="min-h-screen bg-slate-950 p-8 text-slate-200">
        <div className="max-w-2xl mx-auto mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> 메인으로 돌아가기
          </Link>
        </div>
        <h1 className="text-3xl font-serif font-bold text-indigo-400 mb-10 text-center">🔮 복기하는 운명의 기록</h1>

        <div className="grid gap-4 max-w-2xl mx-auto w-full">
          {history.length > 0 ? (
            // ✅ 1. 기록이 있을 때: 리스트 출력
            history.map((item: TarotReading) => <HistoryListItem key={item.id} item={item} onClick={setSelectedItem} />)
          ) : (
            // ✅ 2. 기록이 없을 때: 안내 문구 출력
            <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-slate-400 mb-4">아직 기록된 운명이 없습니다.</p>
              <Link to="/" className="text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-4">
                첫 번째 타로 보러 가기 🔮
              </Link>
            </div>
          )}
        </div>

        <AnimatePresence>
          {selectedItem && <HistoryModal selectedItem={selectedItem} onClose={() => setSelectedItem(null)} />}
        </AnimatePresence>
      </div>
    );
};

export default HistoryPage;
