import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
// import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: configService.get<string>('CORS_HOST'),
    allowedHeaders: ['content-type', 'authorization'],
    credentials: true,
  });
  app.use(cookieParser());
  // app.useGlobalInterceptors(new LoggingInterceptor());
  const PORT = configService.get<string>('PORT');
  await app.listen(PORT);
  logger.log(`Application is listening on port ${PORT}`);
}
bootstrap();
