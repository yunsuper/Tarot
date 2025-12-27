import { motion } from "framer-motion";
import TarotCard from "../../components/tarot/TarotCard";
import type { CardData } from "../../components/common/types";

export default function CardResultList({ cards }: { cards: CardData[] }) {
    return (
        <section className="flex justify-center gap-4 mb-10 w-full">
            {cards.map((card, index) => (
                <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="flex flex-col items-center gap-2"
                >
                    <div className="w-24 md:w-32 transition-transform duration-700">
                        <TarotCard
                            imageFile={card.image_file}
                            name={card.name}
                            isRevealed={true}
                            isReversed={card.isReversed}
                        />
                    </div>
                    <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                        {index === 0
                            ? "Past"
                            : index === 1
                            ? "Present"
                            : "Future"}
                    </span>
                    <div className="text-center">
                        <span className="block text-sm font-serif font-bold text-indigo-200">
                            {card.name}
                        </span>
                        {card.isReversed && (
                            <span className="text-[10px] text-red-400 font-bold border border-red-500/30 px-1 rounded ml-1">
                                REV (역방향)
                            </span>
                        )}
                    </div>
                </motion.div>
            ))}
        </section>
    );
}
