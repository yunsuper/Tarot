// src/api/axiosConfig.ts
import axios from "axios";

// 백엔드 서버 주소 
// 지금은 개발용 로컬 주소로 설정해둔 상태.
const API_BASE_URL = "http://localhost:3000";

export const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    // 타임아웃 (AI모델에 따라 딜레이가 길어질수 있으므로 3000설정.)
    timeout: 30000,
});
