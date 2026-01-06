import { Suspense, lazy } from "react"; // 1. lazy와 Suspense를 불러옵니다.
import { BrowserRouter, Routes, Route } from "react-router-dom";

// 2. 기존 import를 아래와 같이 변경 (코드 스플리팅)
const Home = lazy(() => import("./pages/Home"));
const Question = lazy(() => import("./pages/Question"));
const Result = lazy(() => import("./pages/Result/Result"));
const Shuffle = lazy(() => import("./pages/Shuffle"));
const HistoryPage = lazy(() => import("./pages/History/HistoryPage"));


export default function App() {
  return (
    <BrowserRouter>
      {/* 3. Suspense로 감싸줍니다. 로딩 중에 보여줄 UI를 fallback에 넣습니다. */}
      <Suspense fallback={<div className="text-white">로딩 중...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/question" element={<Question />} />
          <Route path="/shuffle" element={<Shuffle />} />
          <Route path="/result" element={<Result />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
