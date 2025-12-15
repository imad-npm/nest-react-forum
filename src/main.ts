import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Use validation pipe globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true, // auto-convert types
      transformOptions: {
        enableImplicitConversion: true, // allows automatic type conversion
      },
    }),
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  
 
  // Get ConfigService instance
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3000;

  // Serve static files from the 'uploads' directory
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
