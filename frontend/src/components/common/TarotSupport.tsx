// frontend/src/components/common/TarotSupport.tsx
import { motion } from "framer-motion";
import { track } from "@vercel/analytics";

export default function TarotSupport() {
  // 카카오페이 송금 고정 링크
  const KAKAO_PAY_LINK = "https://qr.kakaopay.com/FS0VnQLKd";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="max-w-md mx-auto my-16 p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg text-center shadow-2xl"
    >
      <div className="text-4xl mb-4">🔮</div>
      <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
        해석이 도움이 되셨나요?
      </h3>
      <p className="text-slate-300 text-sm leading-relaxed mb-8">
        따뜻한 복채는 개발자에게 큰 힘이 됩니다.
        <br />
        보내주신 커피 한 잔은 더 정확한 타로 해석을 위한
        <br />
        <strong>AI(Gemini) 운영 비용</strong>으로 소중히 사용됩니다.
      </p>

      <motion.a
        href={KAKAO_PAY_LINK}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("Donation_Button_Click")}
        whileHover={{ scale: 1.05, backgroundColor: "#F7E100" }}
        whileTap={{ scale: 0.95 }}
        className="block w-full py-4 bg-[#FFEB00] text-black font-extrabold rounded-2xl shadow-lg transition-colors text-lg"
      >
        카카오페이로 복채 보내기
      </motion.a>

      <p className="mt-4 text-[10px] text-slate-500 uppercase tracking-widest">Thank you for supporting this project</p>
    </motion.div>
  );
}
