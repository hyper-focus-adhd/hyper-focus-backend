import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as process from 'process';

import { AppModule } from './app.module';
import { corsConfig } from './config/cors.config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: corsConfig.frontEndUrl,
  });

  const config = new DocumentBuilder()
    .addBearerAuth(undefined, 'Access Token')
    .addBearerAuth(undefined, 'Refresh Token')
    .setTitle('Hyper Focus')
    .setDescription('The Hyper Focus API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 8080);
}

bootstrap();
