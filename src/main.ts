import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';
import { environments } from './environments/environments';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api');

  const port =  environments.port || 3000;
  const logger = new Logger('NestApplication');

  await app.listen(port, () =>
    logger.log(`Server initialized on port ${port}`),
  );
}
bootstrap();
