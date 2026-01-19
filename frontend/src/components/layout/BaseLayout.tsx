// src/components/layout/BaseLayout.tsx
import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface BaseLayoutProps {
  children: ReactNode;
}

export default function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      <Header />

      <main className="flex-1 flex flex-col relative z-10 w-full max-w-5xl mx-auto pt-10 md:pt-28 px-4">
        {children}
      </main>

      <Footer />
    </div>
  );
}
