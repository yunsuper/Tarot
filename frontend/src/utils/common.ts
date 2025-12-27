// 밀리초만큼 기다리는 함수 (비동기 처리용)
export const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

// 배열을 무작위로 섞는 함수 (✅ Fisher-Yates shuffle) -> 처음 설계할때 고려했던 함수!
export const shuffleArray = <T>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};
