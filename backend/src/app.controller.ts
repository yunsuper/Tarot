import { GoogleGenerativeAI } from '@google/generative-ai';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  // 환경변수에서 API 키를 가져와서 설정합니다.
  private genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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
    console.log('받은 카드 데이터:', body.cards);
    const cardIdsData = body.cards
      .map((c) => (c.id !== undefined ? c.id : ''))
      .join(',');

    // 1. 프론트엔드에서 보낸 상세 카드 정보(방향 포함)를 텍스트로 정리
    const cardContext = body.cards
      .map((c, i) => {
        const position = ['과거', '현재', '미래'][i];
        const direction = c.isReversed ? '역방향' : '정방향';
        return `${position}: ${c.name} (${direction})`;
      })
      .join(', ');

    // 2. 고품질 해석을 위한 상세 프롬프트 설정
    const model = this.genAI.getGenerativeModel({
      model: 'gemini-flash-latest',
    });
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
      3. 시각적 가독성: 중요한 키워드는 **볼드체**로 강조하고, 문단 사이에 줄바꿈(\\n\\n)을 넣어 읽기 편하게 구성하세요.
    `;

    // 3. AI 해석 생성
    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text();

    //  4. 유저 정보를 먼저 동기화
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

    // 5. AI가 생성한 '진짜 해석'을 DB에 저장
    const savedReading = await this.prisma.reading.create({
      data: {
        question: body.question,
        cards: cardContext,
        result: aiResponse,
        card_ids: cardIdsData, // 고정 문구가 아닌 AI의 상세 해석 저장
        userId: body.userId || null,
      },
    });

    return savedReading;
  }

  // 유저 자동 등록
  @Get('history')
  async getHistory(@Query('userId') userId?: string) {
    // 👈 쿼리 파라미터로 id를 받음
    return await this.prisma.reading.findMany({
      where: userId ? { userId: userId } : {}, // 👈 ID가 있으면 내 것만 필터링!
      orderBy: { createdAt: 'desc' },
    });
  }
}
