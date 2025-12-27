// src/components/layout/Footer.tsx
export default function Footer() {
  return (
    <footer className="w-full py-6 text-center text-slate-500 text-xs mt-auto">
      <p>© 2026 yunsuper Project. All rights reserved.</p>
      <div className="mt-2 flex justify-center gap-4">
        <p>Powered by Gemini & NestJS</p>
        <span className="text-slate-300">|</span>
        <a
          href="/privacy.html"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-slate-800 transition-colors underline underline-offset-2"
        >
          개인정보처리방침
        </a>
      </div>
    </footer>
  );
}