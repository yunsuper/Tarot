import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast"; 

const Home = lazy(() => import("./pages/Home"));
const Question = lazy(() => import("./pages/Question"));
const Shuffle = lazy(() => import("./pages/Shuffle"));
const Result = lazy(() => import("./pages/Result/Result"));
const HistoryPage = lazy(() => import("./pages/History/HistoryPage"));

export default function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <BrowserRouter>
        <Suspense fallback={<div className="text-white">로딩 중...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/question" element={<Question />} />
            <Route path="/shuffle" element={<Shuffle />} />
            <Route path="/result" element={<Result />} />
            <Route path="/history" element={<HistoryPage />} />

            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}
