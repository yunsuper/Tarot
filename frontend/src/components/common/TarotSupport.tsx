import { motion } from "framer-motion";
import { track } from "@vercel/analytics";

export default function TarotSupport() {
  const KAKAO_PAY_LINK = "https://qr.kakaopay.com/FS0VnQLKd";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="w-full max-w-lg mx-auto p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg text-center shadow-2xl"
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

      {/* 1. 모바일 위아래 / PC 좌우 */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6">
        {/* 2. QR 코드 (이미지 경로를 /kakao-qr.png 로 확실히 체크) */}
        <div className="bg-white p-3 rounded-2xl shadow-inner w-36 h-36 flex flex-col items-center justify-center overflow-hidden">
          <img
            src="/kakao-qr.png"
            alt="KakaoPay QR"
            className="w-full h-full object-contain"
            // 이미지가 안 뜰 경우를 대비해 콘솔 확인용 에러 핸들러
            onError={() => console.error("QR 이미지를 찾을 수 없습니다. public 폴더를 확인하세요.")}
          />
        </div>

        {/* 3. 송금 버튼 영역 (모바일/PC 모두 중앙 정렬) */}
        <div className="w-full text-center">
          <motion.a
            href={KAKAO_PAY_LINK}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("Donation_Button_Click")}
            whileHover={{ scale: 1.05, backgroundColor: "#F7E100" }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-full py-4 bg-[#FFEB00] text-black font-extrabold rounded-2xl shadow-lg transition-colors text-lg"
          >
            카카오페이 송금하기
          </motion.a>
          <p className="mt-3 text-[11px] text-slate-400">* 모바일은 버튼 클릭, PC는 QR 스캔</p>
        </div>
      </div>

      <p className="mt-6 text-[10px] text-slate-500 uppercase tracking-widest">Thank you for supporting this project</p>
    </motion.div>
  );
}
