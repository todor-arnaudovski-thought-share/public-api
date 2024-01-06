import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigModule } from '@nestjs/config';
import { EmailConfirmationService } from './email-confirmation.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../models/users/users.module';
import { EmailConfirmation } from './email-confirmation.controller';

@Module({
  imports: [ConfigModule, JwtModule, UsersModule],
  controllers: [EmailConfirmation],
  providers: [EmailService, EmailConfirmationService],
  exports: [EmailService, EmailConfirmationService],
})
export class EmailModule {}
