// 밀리초만큼 기다리는 함수 (비동기 처리용)
export const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

export const shuffleArray = <T>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};
