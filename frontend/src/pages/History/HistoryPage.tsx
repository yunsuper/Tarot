import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { client } from "../../api/axiosConfig";
import { AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import HistoryListItem from "./HistoryListItem.tsx";
import HistoryModal from "./HistoryModal";
import type { TarotReading } from "./types";
import { supabase } from "../../utils/supabaseClient";
import BaseLayout from "../../components/layout/BaseLayout";

const HistoryPage = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState<TarotReading[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<TarotReading | null>(null);

    useEffect(() => {
      const fetchHistory = async () => {
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (!session?.user) {
            navigate("/", { state: { fromForbidden: true } });
            return;
          }

          const userId = session.user.id;

          const response = await client.get(`/history`, {
            params: { userId },
          });
          // const response = await axios.get(
          //   `http://localhost:3000/history`,
          //   { params: { userId } }, // ?userId=UUID 형태로 전송됨
          // );

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
      <BaseLayout>
        <div className="w-full max-w-2xl mx-auto px-4 pb-20">
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span> 메인으로 돌아가기
            </Link>
          </div>
          <h1 className="text-3xl font-serif font-bold text-indigo-400 mb-10 text-center">🔮 복기하는 운명의 기록</h1>

          <div className="flex flex-col gap-4 w-full">
            {history.length > 0 ? (
              history.map((item: TarotReading) => (
                <HistoryListItem key={item.id} item={item} onClick={setSelectedItem} />
              ))
            ) : (
              <div className="text-center py-24 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                <p className="text-slate-400 mb-6">아직 기록된 운명이 없습니다.</p>
                <Link
                  to="/"
                  className="px-6 py-3 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 rounded-full transition-all border border-indigo-500/30"
                >
                  첫 번째 타로 보러 가기 🔮
                </Link>
              </div>
            )}
          </div>
        </div>

        <AnimatePresence>
          {selectedItem && <HistoryModal selectedItem={selectedItem} onClose={() => setSelectedItem(null)} />}
        </AnimatePresence>
      </BaseLayout>
    );
};

export default HistoryPage;
