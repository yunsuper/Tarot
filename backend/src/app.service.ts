import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { ReadingService } from './reading.service';
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
    private readingService: ReadingService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY') || '';

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-3-flash-preview',
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

  async getReading(
    question: string,
    cards: { name: string; isReversed: boolean }[],
    userId?: string,
  ): Promise<InterpretationResult> {
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

    const prompt = `
      당신은 질문자의 기운을 읽고 운명의 실타래를 풀어주는 신비롭고 권위 있는 타로 마스터입니다.
      사용자의 질문: "${question}"
      선택된 카드 정보:
      ${cardsInfo.join('\n')}

      [답변 가이드라인]
      1. 말투: 고풍스럽고 신비로운 마스터의 말투(~일 것입니다, ~하십시오, ~의 기운이 서려 있습니다)를 유지하세요.
      2. 구조 (전체 15~20문장 내외의 풍부한 분량):
         - **도입**: 질문자의 현재 에너지 상태를 읽어주는 신비로운 서문 (2-3문장)
         - **카드별 심층 해석**: 각 카드의 회화적 상징, 수비학적 의미, 질문과의 운명적 연결고리를 상세히 풀어서 설명하세요. (카드가 여러 장일 경우 각 장의 관계성을 포함)
         - **종합적 운명의 흐름**: 과거부터 미래로 이어지는 거대한 흐름과 현재 질문자가 놓인 위치를 명확히 짚어주세요.
         - **마스터의 비책**: 단순히 따뜻한 위로와 질문자가 오늘 바로 실천할 수 있는 구체적인 '행동 지침' 2~3가지를 포함하세요.
      3. 이모지 및 시각적 가독성: 
         - 각 섹션이나 핵심 키워드 옆에 문맥에 어울리는 **신비로운 이모지**(🔮, ✨, 🌙, 🕯️, 📜, 🛡️ 등)를 적절히 배치하여 생동감을 더하세요.
         - 중요한 단어는 **볼드체**로 강조하고, 문단 사이에는 반드시 이중 줄바꿈을 넣어 가독성을 높이세요.

      반드시 아래 JSON 형식으로만 대답하세요:
      {
        "summary": "신비로운 통찰이 담긴 한 줄 요약 (이모지 포함)",
        "detail": "위 가이드라인에 따라 작성된 품격 있는 상세 해석"
      }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;

      const text = response
        .text()
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      const parsedResult = JSON.parse(text) as {
        summary: string;
        detail: string;
      };

      const interpretation: InterpretationResult = {
        summary: parsedResult.summary || '별들의 목소리가 희미합니다...',
        detail: parsedResult.detail || '해석을 불러오지 못했습니다.',
      };

      await this.readingService.createReading({
        userId,
        question,
        result: interpretation.detail,
        cards,
      });

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
