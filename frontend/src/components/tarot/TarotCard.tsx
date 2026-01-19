import { useState } from "react";
import { motion } from "framer-motion";
import { getCardImgPath } from "../../utils/imageHandler";

interface TarotCardProps {
  imageFile: string;
  name: string;
  isRevealed?: boolean;
  isReversed?: boolean;
}

export default function TarotCard({ imageFile, name, isRevealed = false, isReversed = false }: TarotCardProps) {
  const [internalFlip, setInternalFlip] = useState(false);

  const isFlipped = isRevealed || internalFlip;

  return (
    <div className="relative w-full aspect-[3/5] [perspective:1000px]">
      <motion.div
        className="w-full h-full relative"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        onClick={() => setInternalFlip(!internalFlip)}
      >
        <div
          className="absolute inset-0 w-full h-full rounded-xl overflow-hidden shadow-xl border-2 border-white/10 bg-indigo-900"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img src={getCardImgPath("")} alt="Card Back" className="w-full h-full object-cover" />
        </div>

        <div
          className="absolute inset-0 w-full h-full rounded-xl overflow-hidden shadow-xl bg-black"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
          }}
        >
          <img
            src={getCardImgPath(imageFile)}
            alt={name}
            fetchPriority={imageFile === "m00.webp" ? "high" : "auto"}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{
              transform: isReversed ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />

          <div className="absolute bottom-0 left-0 right-0 p-2 text-center bg-gradient-to-t from-black/80 to-transparent pt-6">
            <p className="text-white text-xs font-serif tracking-wider opacity-90">{name}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
