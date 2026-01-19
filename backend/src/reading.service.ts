import { Injectable } from '@nestjs/common';
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
      orderBy: { createdAt: 'desc' },
    });
  }
}
