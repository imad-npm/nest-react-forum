import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );

  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT') ?? 3000;
  const nodeEnv = configService.get<string>('NODE_ENV') ?? 'development';

  // =========================================================
  // Middleware
  // =========================================================

  app.use(cookieParser());


  // =========================================================
  // Validation
  // =========================================================

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );


  // =========================================================
  // API prefix
  // =========================================================

  app.setGlobalPrefix('api');


  // =========================================================
  // CORS
  // =========================================================

  if (nodeEnv !== 'production') {
    app.enableCors({
      origin: 'http://localhost:5173',
      credentials: true,
    });
  }


  // =========================================================
  // Static uploads
  // =========================================================

  app.useStaticAssets(
    join(__dirname, '..', 'uploads'),
    {
      prefix: '/uploads/',
    },
  );


  // =========================================================
  // Start server
  // =========================================================

  await app.listen(port, '0.0.0.0');

  console.log(
    `NestJS running on http://localhost:${port}`,
  );
}

bootstrap();