import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Keep your existing API prefix if you have one
  app.setGlobalPrefix('api'); 

  // 1. ENABLE CORS: This allows your React app to talk to the backend!
  app.enableCors(); 

  // 2. DYNAMIC PORT BINDING: Look for Render's port, fallback to 3000
  const port = process.env.PORT || 3000;
  
  await app.listen(port);
  console.log(`🚀 Synapse Backend is successfully running on port ${port}`);
}
bootstrap();