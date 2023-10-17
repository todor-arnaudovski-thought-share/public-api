import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
// import { LoggingInterceptor } from './logging.interceptor';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    allowedHeaders: ['content-type', 'authorization'],
    origin: 'http://localhost:5173',
    credentials: true,
  });
  app.use(cookieParser());
  // app.useGlobalInterceptors(new LoggingInterceptor());
  const PORT = 3000;
  await app.listen(PORT);
  logger.log(`Application is listening on port ${PORT}`);
}
bootstrap();
