import { useState } from "react";
import toast from "react-hot-toast"; // 알림창 라이브러리 (처음에 설치함)

export const useShare = () => {
    const [isSharing, setIsSharing] = useState(false);

    // 텍스트로 결과를 복사하는 함수
    const shareResult = async (summary: string, detail: string) => {
        setIsSharing(true);

        // 복사할 텍스트 포맷 만들기
        const shareText = `
🔮 Tarot AI 운세 결과 🔮

✨ 요약: ${summary}
💡 팁: ${detail}

- Tarot AI에서 확인 -
    `.trim();

        try {
            // 클립보드에 복사
            await navigator.clipboard.writeText(shareText);

            // 성공 알림 (Toast)
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
