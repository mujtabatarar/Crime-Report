import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import appConfig from 'config/appConfig';

require('dotenv').config();

const logger = new Logger();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.startAllMicroservicesAsync();
  await app.listen(appConfig().TCPPort);

  logger.log(
    'Udemy Micro-service is listening on port: ' + appConfig().TCPPort,
  );
}
bootstrap();
