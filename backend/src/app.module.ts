import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // ✅ 이 줄이 꼭 있어야 함
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { ReadingService } from './reading.service';

@Module({
  imports: [
    // ✅ 설정 모듈을 '전역(Global)'으로 불러와야 다른 파일들이 갖다 쓸 수 있습니다.
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, ReadingService],
})
export class AppModule {}
