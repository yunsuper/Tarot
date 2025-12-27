import { Injectable } from '@nestjs/common';
// ✅ 1. 경로 수정 (reading.service.ts와 같은 폴더에 prisma/ 폴더가 있다면)
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class ReadingService {
  constructor(private prisma: PrismaService) {}

  async createReading(data: {
    userId?: string;
    question: string;
    result: string;
    cards: any;
  }) {
    // ✅ 2. await 추가 (Prisma 작업은 비동기이므로 반드시 필요)
    return await this.prisma.reading.create({
      data: {
        question: data.question,
        result: data.result,
        cards: JSON.stringify(data.cards),
        userId: data.userId || null,
      },
    });
  }

  async getUserHistory(userId: string) {
    return await this.prisma.reading.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }, // 최신순 정렬
    });
  }
}
