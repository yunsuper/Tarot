import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정 구체화
  app.enableCors({
    origin: [
      'http://localhost:5173', // 로컬 개발 환경
      'https://tarot-mauve.vercel.app', // 방금 배포된 Vercel 주소
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Railway에서 제공하는 PORT 환경변수를 우선 사용하도록 설정
  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}

bootstrap().catch((err) => {
  console.error('서버 시작 중 에러 발생:', err);
});
