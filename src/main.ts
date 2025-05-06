import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CORS } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const configServices = app.get(ConfigService);

  app.enableCors(CORS);

  app.setGlobalPrefix('v1');

  await app.listen(configServices.get('PORT'));

  console.log(`Application is running on: ${await app.getUrl()}/v1`);
}
bootstrap();
