import { useState } from "react";
import toast from "react-hot-toast";

export const useShare = () => {
    const [isSharing, setIsSharing] = useState(false);

    const shareResult = async (summary: string, detail: string) => {
        setIsSharing(true);

        const shareText = `
🔮 Tarot AI 운세 결과 🔮

✨ 요약: ${summary}
💡 팁: ${detail}

- Tarot AI에서 확인 -
    `.trim();

        try {
            await navigator.clipboard.writeText(shareText);

            toast.success("결과가 클립보드에 복사되었습니다!", {
                duration: 2000,
                position: "bottom-center",
                style: {
                    background: "#333",
                    color: "#fff",
                },
            });
        } catch (err) {
            console.error("복사 실패:", err);
            toast.error("복사에 실패했습니다.");
        } finally {
            setIsSharing(false);
        }
    };

    return { shareResult, isSharing };
};
