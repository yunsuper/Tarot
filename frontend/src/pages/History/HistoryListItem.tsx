// src/pages/History/HistoryListItem.tsx
import { motion } from "framer-motion";
import type { TarotReading } from "./types"; 

interface HistoryListItemProps {
    item: TarotReading; 
    onClick: (item: TarotReading) => void; 
}

const HistoryListItem = ({ item, onClick }: HistoryListItemProps) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => onClick(item)}
            className="bg-white/5 p-5 rounded-2xl border border-white/10 cursor-pointer hover:bg-white/10 transition-all"
        >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                <h2 className="text-lg font-medium break-words md:truncate flex-1">
                    "{item.question}"
                </h2>
                <span className="text-xs text-slate-500 whitespace-nowrap">
                    {new Date(item.createdAt).toLocaleDateString()}
                </span>
            </div>
        </motion.div>
    );
};

export default HistoryListItem;
