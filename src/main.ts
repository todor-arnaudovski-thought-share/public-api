import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  Logger,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        const result = errors.map((error) => ({
          property: error.property,
          message: error.constraints[Object.keys(error.constraints)[0]],
        }));

        return new BadRequestException(result);
      },
    }),
  );
  app.enableCors({
    origin: configService.get<string>('CORS_HOST'),
    allowedHeaders: ['content-type', 'authorization'],
    credentials: true,
  });
  app.use(cookieParser());

  const PORT = configService.get<string>('PORT');
  await app.listen(PORT);
  logger.log(`Application is listening on port ${PORT}`);
}
bootstrap();
