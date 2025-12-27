// src/api/axiosConfig.ts
import axios from "axios";

// 환경 변수에서 주소를 가져오고, 없으면 기본값으로 로컬 주소를 사용합니다.
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // AI 모델 응답 시간에 맞춰 30초로 설정하신 것 아주 좋습니다.
  timeout: 30000,
});

// // src/api/axiosConfig.ts
// import axios from "axios";

// // 백엔드 서버 주소
// // 지금은 개발용 로컬 주소로 설정해둔 상태.
// const API_BASE_URL = "http://localhost:3000";

// export const client = axios.create({
//     baseURL: API_BASE_URL,
//     headers: {
//         "Content-Type": "application/json",
//     },
//     // 타임아웃 (AI모델에 따라 딜레이가 길어질수 있으므로 3000설정.)
//     timeout: 30000,
// });
