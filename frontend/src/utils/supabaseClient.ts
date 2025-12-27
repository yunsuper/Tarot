// frontend/src/utils/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// .env에 적은 VITE_ 변수들을 가져옵니다.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 클라이언트 객체 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
