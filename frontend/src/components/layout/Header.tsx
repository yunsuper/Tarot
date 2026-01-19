// src/components/layout/Header.tsx
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import Login from "../Login";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="w-full p-4 flex justify-between items-start bg-transparent absolute top-0 z-50">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 font-serif font-bold text-lg md:text-xl text-white hover:text-yellow-400 transition-colors mt-1"
      >
        <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
        Tarot AI
      </button>

      <div className="flex flex-col items-end text-right">
        <Login />
      </div>
    </header>
  );
}
