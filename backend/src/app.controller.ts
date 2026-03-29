// app.controller.ts
import { GoogleGenAI } from '@google/genai';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  private ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

  constructor(private readonly prisma: PrismaService) {}

  @Post('reading')
  async createReading(
    @Body()
    body: {
      question: string;
      cards: {
        id: number;
        name: string;
        isReversed: boolean;
      }[];
      userId?: string;
      email?: string;
    },
  ) {
    const cardIdsData = body.cards
      .map((c) => (c.id !== undefined ? c.id : ''))
      .join(',');

    const cardContext = body.cards
      .map((c, i) => {
        const position = ['과거', '현재', '미래'][i];
        const direction = c.isReversed ? '역방향' : '정방향';
        return `${position}: ${c.name} (${direction})`;
      })
      .join(', ');

    const prompt = `
      당신은 질문자의 기운을 읽고 운명의 실타래를 풀어주는 신비롭고 권위 있는 타로 마스터입니다.
      사용자의 질문: "${body.question}"
      선택된 카드 정보:
      ${cardContext}

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
    `;

    const result = await this.ai.models.generateContent({
      model: 'gemini-3.1-flash-lite', // 모델명 업데이트
      contents: prompt,
    });
    const aiResponse = result.text || '해석을 가져오는 데 실패했습니다.';

    if (body.userId && body.email) {
      await this.prisma.user.upsert({
        where: { id: body.userId },
        update: { email: body.email },
        create: {
          id: body.userId,
          email: body.email,
        },
      });
    }

    const savedReading = await this.prisma.reading.create({
      data: {
        question: body.question,
        cards: cardContext,
        result: aiResponse,
        card_ids: cardIdsData,
        userId: body.userId || null,
      },
    });

    return savedReading;
  }

  @Get('history')
  async getHistory(@Query('userId') userId?: string) {
    return await this.prisma.reading.findMany({
      where: userId ? { userId: userId } : {},
      orderBy: { createdAt: 'desc' },
    });
  }
}
