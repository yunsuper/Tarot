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
      당신은 신비롭고 통찰력 있는 타로 마스터입니다.
      사용자의 질문: "${body.question}"
      선택된 카드 정보:
      ${cardContext}

      위 정보를 바탕으로 다음 내용을 포함하여 아주 상세하고 전문적으로 답변해주세요:
      - 각 카드의 상징과 질문 사이의 연관성 (역방향일 경우 그 의미를 반전하여 해석)
      - 세 카드가 그리는 전체적인 운명의 흐름
      - 사용자를 위한 구체적인 행동 지침과 따뜻한 조언 (5줄 이상의 장문으로 작성)
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
