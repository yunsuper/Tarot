import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.disable('x-powered-by');

  app.enableCors({
    origin: [
      'http://localhost:5173', // 로컬 개발 환경
      'https://tarot-mauve.vercel.app', // 방금 배포된 Vercel 주소
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000, '0.0.0.0');

  Logger.log(`Node.js ${process.version}`, 'Runtime');
}

bootstrap().catch((err) => {
  console.error('서버 시작 중 에러 발생:', err);
});
