import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 1. Enable validation (checks your DTOs)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  
  // 2. Allow your React frontend to talk to this backend
  app.enableCors({ origin: 'http://localhost:5173' });
  
  // 3. Put all routes under /api (e.g., localhost:3000/api/auth/register)
  app.setGlobalPrefix('api');
  
  await app.listen(3000);
  console.log(`🚀 Vantage Backend is running on: http://localhost:3000/api`);
}
bootstrap();  