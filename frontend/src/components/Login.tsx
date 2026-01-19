// src/components/Login.tsx
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import type{ User } from "@supabase/supabase-js";

const Login = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = () => supabase.auth.signInWithOAuth({ provider: "google" });
  const handleLogout = () => supabase.auth.signOut();

  if (user) {
    return (
      <div className="flex flex-col items-end gap-1">
        <span className="text-white text-[11px] md:text-sm whitespace-nowrap">
          {user.user_metadata.full_name}님 환영합니다 🔮
        </span>
        <button
          onClick={handleLogout}
          className="text-[10px] md:text-xs px-2 py-1 border border-slate-600 text-slate-300 rounded hover:bg-slate-800 transition-colors"
        >
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleLogin}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 16px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
      }}
    >
      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" style={{ width: "14px" }} />
      Google로 시작하기
    </button>
  );
};

export default Login;
