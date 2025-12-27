import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Question from "./pages/Question";
import Shuffle from "./pages/Shuffle";
import Result from "./pages/Result/Result";
import HistoryPage from "./pages/History/HistoryPage";
import { Toaster } from "react-hot-toast";

function App() {
    return (
      <>
        <Toaster position="top-center" reverseOrder={false} />
        <BrowserRouter>
          <Routes>
            {/* URL 경로와 페이지를 매칭 */}
            <Route path="/" element={<Home />} />
            <Route path="/question" element={<Question />} />
            <Route path="/shuffle" element={<Shuffle />} />
            <Route path="/result" element={<Result />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </BrowserRouter>
      </>
    );
}

export default App;
