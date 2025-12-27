import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { ReadingService } from './reading.service'; // ✅ ReadingService 임포트
import * as tarotDataRaw from './data/tarot_data.json';

export interface InterpretationResult {
  summary: string;
  detail: string;
}

export interface TarotCard {
  id: number;
  name: string;
  name_kr: string;
  keywords: string[];
}

export interface DrawnCard extends TarotCard {
  isReversed: boolean;
}

interface TarotDataImport {
  default?: TarotCard[];
  [key: string]: any;
}

@Injectable()
export class AppService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;
  private tarotDeck: TarotCard[];

  constructor(
    private configService: ConfigService,
    private readingService: ReadingService, // ✅ ReadingService 주입
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY') || '';
    console.log('🔑 .env 키 로드 완료');

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-lite',
    });

    const rawData = tarotDataRaw as unknown as TarotDataImport;
    if (rawData.default && Array.isArray(rawData.default)) {
      this.tarotDeck = rawData.default;
    } else {
      this.tarotDeck = Object.values(rawData).filter(
        (item): item is TarotCard => {
          return typeof item === 'object' && item !== null && 'name' in item;
        },
      );
    }
  }

  getAllCards(): TarotCard[] {
    return this.tarotDeck;
  }

  drawCards(count: number): DrawnCard[] {
    const deck = [...this.tarotDeck];
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck.slice(0, count).map((card) => ({
      ...card,
      isReversed: Math.random() < 0.5,
    }));
  }

  // ✅ userId 파라미터 추가 및 DB 저장 로직 통합
  async getReading(
    question: string,
    cards: { name: string; isReversed: boolean }[],
    userId?: string, // ✅ 컨트롤러에서 넘겨받을 ID
  ): Promise<InterpretationResult> {
    // 1. 카드 정보 컨텍스트 구성
    const cardsInfo = cards.map((c, i) => {
      const originalCard = this.tarotDeck.find((tc) => tc.name === c.name);
      const position = ['과거', '현재', '미래'][i];
      const direction = c.isReversed
        ? '🔴역방향(Reversed)'
        : '🔵정방향(Upright)';
      const keywords = originalCard
        ? JSON.stringify(originalCard.keywords)
        : '';

      return `${position}: ${c.name}(${originalCard?.name_kr}) - [${direction}]: 키워드 ${keywords}`;
    });

    // 2. 신비로운 타로 마스터 프롬프트 설정
    const prompt = `
      당신은 신비롭고 통찰력 있는 타로 마스터입니다.
      사용자의 질문: "${question}"
      선택된 카드 정보:
      ${cardsInfo.join('\n')}

      위 정보를 바탕으로 다음 내용을 포함하여 아주 상세하고 전문적으로 답변해주세요:
      - 각 카드의 상징과 질문 사이의 연관성 (역방향일 경우 그 의미를 반전하여 해석)
      - 세 카드가 그리는 전체적인 운명의 흐름
      - 사용자를 위한 구체적인 행동 지침과 따뜻한 조언 (5줄 이상의 장문으로 작성)

      반드시 JSON 형식으로만 대답해:
      {
        "summary": "신비로운 한 줄 요약(이모지 포함)",
        "detail": "위 지침을 모두 포함한 상세 해석(5줄 이상의 장문)"
      }
    `;

    try {
      // 3. AI 해석 생성
      const result = await this.model.generateContent(prompt);
      const response = result.response;

      // ✅ 해결 1: 재할당 안 하므로 let 대신 const 사용
      const text = response
        .text()
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      // ✅ 해결 2: JSON.parse 결과에 타입을 명시하여 'any' 에러 방지
      const parsedResult = JSON.parse(text) as {
        summary: string;
        detail: string;
      };

      const interpretation: InterpretationResult = {
        summary: parsedResult.summary || '별들의 목소리가 희미합니다...',
        detail: parsedResult.detail || '해석을 불러오지 못했습니다.',
      };

      // 4. DB에 결과 저장
      await this.readingService.createReading({
        userId,
        question,
        result: interpretation.detail,
        cards,
      });

      console.log('✅ DB 저장 완료 (userId:', userId || 'Guest', ')');

      return interpretation;
    } catch (error) {
      console.error('해석 생성 또는 DB 저장 실패:', error);
      return {
        summary: '운명의 흐름이 끊겼습니다 🌌',
        detail: 'AI 또는 데이터베이스 연결에 실패했습니다.',
      };
    }
  }
}
