import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast"; 

// lazy 로딩 설정
const Home = lazy(() => import("./pages/Home"));
const Question = lazy(() => import("./pages/Question"));
const Shuffle = lazy(() => import("./pages/Shuffle"));
const Result = lazy(() => import("./pages/Result/Result"));
const HistoryPage = lazy(() => import("./pages/History/HistoryPage"));

export default function App() {
  return (
    <>
      {/* 2. Toaster는 라우터 밖에 두어 어디서든 알림이 뜨게 */}
      <Toaster position="top-center" reverseOrder={false} />

      <BrowserRouter>
        <Suspense fallback={<div className="text-white">로딩 중...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/question" element={<Question />} />
            <Route path="/shuffle" element={<Shuffle />} />
            <Route path="/result" element={<Result />} />
            <Route path="/history" element={<HistoryPage />} />

            {/*  잘못된 경로 접근 시 홈으로 리다이렉트하거나 404 페이지 추가 */}
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}
