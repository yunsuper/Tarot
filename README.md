# 🔮 AI Tarot Master: 운명의 속삭임

Gemini AI를 활용하여 사용자의 고민을 깊이 있게 해석해주는 웹 타로 서비스입니다. 
전통적인 타로 해석에 최신 AI 기술을 접목하여 개인화된 경험을 제공합니다.

---

## ✨ 주요 기능 (Key Features)
- **AI 타로 해석**: Google Gemini 3.1 flash-lite 모델을 활용한 정교한 카드 리딩
- **실시간 로딩 애니메이션**: Framer Motion을 활용한 몰입감 있는 사용자 경험
- **개인 히스토리**: 과거에 본 타로 내역을 다시 확인할 수 있는 저장 기능
- **결과 공유**: 해석 결과를 텍스트로 복사하여 간편하게 공유

## 🚀 배포 주소 (Deployment)
https://tarot-mauve.vercel.app
- 배포 아키텍처:
  - Front-end: Vercel (Auto Deployment)
  - Back-end: Render (NestJS 서버 호스팅)
  - Database: Supabase


## 📸 서비스 화면 (Screenshots)

### 🔮 메인 및 타로 리딩
| 메인 페이지 | 카드 선택 | 해석 결과 |
| :---: | :---: | :---: |
| <img src="https://github.com/user-attachments/assets/01425e63-5fdc-4685-92df-23e3071a26cf" width="250"> | <img src="https://github.com/user-attachments/assets/2ada3d26-9d5a-479b-92db-61e780db4bce" width="250"> | <img src="https://github.com/user-attachments/assets/f992e942-610d-44df-99e4-965370e041d4" width="250"> |

### 📜 결과 확인 이후 및 히스토리
| 결과 후 액션 | 나의 히스토리 (목록) | 지난 기록 다시보기 |
| :---: | :---: | :---: |
| <img src="https://github.com/user-attachments/assets/94daf1e5-a527-4a0e-8b9a-96862fd34665" width="200"> | <img src="https://github.com/user-attachments/assets/1220ac21-070b-4b68-95f6-050ff5dda4b4" width="300"> | <img src="https://github.com/user-attachments/assets/7bb8a456-b6ea-4794-89c1-b5c7ee3f4233" width="200"> |

## 🛠 기술 스택 (Tech Stack)

### Frontend
- **Framework**: React (TypeScript)
- **Routing**: React Router
- **Build Tool**: Vite
- **Data Fetching**: Axios
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **UI Feedback**: React Hot Toast
- **State Management**: Zustand

### Backend
- **Runtime**: Node.js 24.22.1+ (LTS)
- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Communication**: Axios
- **Auth/Storage**: Supabase
- **Hosting**: Render
- **AI Integration**: Google Gemini 3.1 Flash-Lite (@google/genai SDK)

---

## 📂 프로젝트 구조 (Structure)
- `frontend/`: React 기반 웹 클라이언트
- `backend/`: NestJS 기반 API 서버

## 🎮 사용 방법 (How to Use)
1. **질문 입력**: 오늘 하루의 운세나 고민 중인 질문을 입력창에 적어주세요.
2. **카드 선택**: 화면에 놓인 타로 카드 중 마음이 끌리는 카드를 선택합니다.
3. **AI 해석 대기**: Gemini AI가 당신의 질문과 카드를 분석하여 해석을 준비하는 동안 잠시 기다려주세요.
4. **결과 확인 및 저장**: 정교한 타로 해석 결과를 읽고, 마음에 든다면 텍스트로 복사하거나 로그인하여 히스토리에 저장하세요!

---
## 서비스 아키텍처 (Service Architecture)
- **Client**: React + Vite (SPA)
- **Server**: NestJS (REST API)
- **AI**: Google Gemini API (`@google/genai`, Markdown 텍스트 응답)
- **DB/Auth**: Supabase (PostgreSQL)

##  핵심 구현 포인트 (Core Implementation)

### 1. Gemini 3.1 Flash-Lite 기반 AI 타로 리딩
- **프롬프트 엔지니어링**: 타로 마스터의 페르소나를 정밀하게 설정하여 일관성 있고 신뢰감 있는 해석 제공
- **가독성 중심의 응답 형식**: 도입 → 카드별 심층 해석 → 종합적 운명의 흐름 → 마스터의 비책 구조로, 이모지·볼드체·문단 구분을 포함한 Markdown 텍스트로 응답하도록 프롬프트에서 지정

### 2. 하이브리드 세션 관리 (로그인 & 비로그인)
- **사용자 경험 최적화**: 비로그인 상태에서도 타로 해석을 즉시 볼 수 있도록 `isSessionLoaded` 상태 로직 구현
- **데이터 자동 동기화**: 모든 해석 결과를 Supabase DB에 저장하며, 로그인 사용자의 결과는 사용자 ID와 연결되어 마이페이지(History)에서 확인 가능하도록 구현

### 3. 몰입감 있는 UI/UX 설계
- **애니메이션**: `Framer Motion`을 활용하여 실제 타로 카드를 뽑는 듯한 생동감 있는 인터랙션 구현
- **비동기 상태 처리**: `Axios` 인터셉터와 `React Hot Toast`를 연동하여 AI 응답 대기 및 에러 상황을 사용자에게 친절하게 안내
---
## 🔌 핵심 API 명세 (Core API)

### AI Interpretation
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/reading` | 질문과 선택한 카드(`id`, `name`, `isReversed`)를 전달하면 Gemini AI의 해석 결과를 생성하고 DB에 저장 (로그인 시 `userId`, `email` 함께 전달) |
| `GET` | `/history` | 저장된 타로 내역을 최신순으로 조회 (`?userId=` 쿼리로 해당 사용자의 기록만 조회) |

### 🧠 AI 연동 로직 (AI Integration)
- **SDK**: Google 공식 `@google/genai` SDK의 `GoogleGenAI` 클라이언트로 `gemini-3.1-flash-lite` 모델과 통신
- **호출 위치**: NestJS `AppController`의 `POST /reading` 핸들러에서 Gemini 호출 → Prisma로 결과 저장까지 한 번에 처리
- **Prompt Design**: 
  - 과거·현재·미래 위치와 정/역방향 정보를 프롬프트에 함께 담아 카드 맥락을 전달
  - 말투, 분량(15~20문장), 섹션 구조, 이모지·볼드체 사용 규칙을 프롬프트에 명시하여 일관된 타로 마스터의 톤앤매너 유지
  
---

## ⚖️ License & Credits
- **Tarot Design Standard**: 전 세계 표준인 **라이더 웨이트(Rider-Waite) 타로**의 상징 체계와 규격을 바탕으로 설계되었습니다.
- **Tarot Card Images**: 본 프로젝트에 사용된 타로 카드 실물 이미지(PNG)는 **나노바나나(Nanobanana)**의 에셋을 활용하여 제작되었습니다.
- **Author**: [yunsuper](https://github.com/yunsuper) (Full-stack Development)
- **License**: [MIT License](./LICENSE) - 본 프로젝트는 MIT 라이선스를 따르며, 자유로운 이용과 수정이 가능합니다.
- **AI Disclaimer**: 본 프로젝트의 타로 해석 결과는 **Google Gemini 3.1 Flash-lite** 모델에 의해 생성되었습니다. AI의 해석은 참고용일 뿐이며, 법적·의학적·전문적 조언을 대신할 수 없습니다.

## 🤖 AI Aided Development
- 본 프로젝트의 코드 설계 및 최적화 과정에서 AI 기술(Gemini)을 보조 도구로 활용하여 코드 품질을 향상시켰습니다.