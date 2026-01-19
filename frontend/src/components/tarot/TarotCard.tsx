import { useState } from "react";
import { motion } from "framer-motion";
import { getCardImgPath } from "../../utils/imageHandler"; // ✅ 유틸 함수 불러오기

interface TarotCardProps {
  imageFile: string; // 예: "m00.webp"
  name: string; // 예: "The Fool"
  isRevealed?: boolean; // 외부에서 뒤집힘 제어
  isReversed?: boolean;
}

export default function TarotCard({ imageFile, name, isRevealed = false, isReversed = false }: TarotCardProps) {
  // 내부 상태 (클릭해서 뒤집기- 테스트용)
  const [internalFlip, setInternalFlip] = useState(false);

  // props(isRevealed)가 true거나, 내부 클릭(internalFlip)이 true면 뒤집힘
  const isFlipped = isRevealed || internalFlip;

  return (
    <div className="relative w-full aspect-[3/5] [perspective:1000px]">
      <motion.div
        className="w-full h-full relative"
        style={{ transformStyle: "preserve-3d" }} // 3D 효과 필수 스타일
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        onClick={() => setInternalFlip(!internalFlip)}
      >
        {/* --- 뒷면 (Back) --- */}
        <div
          className="absolute inset-0 w-full h-full rounded-xl overflow-hidden shadow-xl border-2 border-white/10 bg-indigo-900"
          style={{ backfaceVisibility: "hidden" }} // 뒷면 숨김 처리
        >
          {/* ✅ 유틸 함수 사용: 빈 문자열을 넣으면 뒷면 경로 반환 */}
          <img src={getCardImgPath("")} alt="Card Back" className="w-full h-full object-cover" />
        </div>

        {/* --- 앞면 (Front) --- */}
        <div
          className="absolute inset-0 w-full h-full rounded-xl overflow-hidden shadow-xl bg-black"
          style={{
            transform: "rotateY(180deg)", // 미리 180도 돌려놓음 (뒤집혔을 때 정면이 되도록)
            backfaceVisibility: "hidden",
          }}
        >
          {/* ✅ 유틸 함수 사용: 이미지 파일명으로 경로 생성 */}
          <img
            src={getCardImgPath(imageFile)}
            alt={name}
            fetchPriority={imageFile === "m00.webp" ? "high" : "auto"}
            className="w-full h-full object-cover transition-transform duration-500"
            // ✅ Tailwind 클래스 대신 직접 스타일을 주입하여 강제로 회전시킵니다.
            style={{
              transform: isReversed ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />

          {/* (선택사항) 카드 하단 이름 오버레이 */}
          <div className="absolute bottom-0 left-0 right-0 p-2 text-center bg-gradient-to-t from-black/80 to-transparent pt-6">
            <p className="text-white text-xs font-serif tracking-wider opacity-90">{name}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
