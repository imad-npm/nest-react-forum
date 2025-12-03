import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true ,
      transform: true, // auto-convert types
       transformOptions: {
    enableImplicitConversion: true, // <--- This is the key
  },
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
