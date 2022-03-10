import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: 'http://localhost:3000',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: true,
      optionsSuccessStatus: 204,
    },
  });
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(443);
}
bootstrap();
