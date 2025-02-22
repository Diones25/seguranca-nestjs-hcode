import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  app.use(helmet());

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('API de Autenticação e Authorização com JWT')
    .setDescription('Esta API implementa emdpoints de autenticação e authorização com JWT e além disso, implementa um sistema de controle de acesso baseado em roles.')
    .setVersion('1.0')
    .build();
  
  const documentFactory = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
  Logger.log(`Servidor rodando em http://localhost:${process.env.PORT ?? 3000}`);
}
bootstrap();
