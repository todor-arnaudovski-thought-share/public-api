import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as Mail from 'nodemailer/lib/mailer';
import { EmailService } from './email.service';
import { VerificationTokenPayload } from './interfaces/verification-token-payload';
import { UsersService } from '../models/users/users.service';

@Injectable()
export class EmailConfirmationService {
  private nodemailerTransport: Mail;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
  ) {}

  public async sendVerificationLink(email: string) {
    try {
      const payload: VerificationTokenPayload = { email };

      const token = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('EMAIL_JWT_SECRET'),
        expiresIn: this.configService.get<string>('EMAIL_JWT_EXPIRE'),
      });

      const emailConfirmationUrl = this.configService.get<string>(
        'EMAIL_CONFIRMATION_URL',
      );
      const url = `${emailConfirmationUrl}?token=${token}`;
      const text = `Welcome to the application. To confirm the email address, click here: ${url}`;

      return await this.emailService.sendMail({
        to: email,
        subject: 'Email confirmation',
        text,
      });
    } catch (err) {
      throw new InternalServerErrorException(
        'Error sending verification email',
      );
    }
  }

  public async confirmEmail(email: string) {
    const user = await this.usersService.findByEmail(email);

    if (user?.isEmailVerified) {
      throw new BadRequestException('Email already verified');
    }

    await this.usersService.markEmailAsVerified(email);
  }

  public async decodeConfirmationToken(token: string): Promise<string> {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get<string>('EMAIL_JWT_SECRET'),
      });

      if (typeof payload === 'object' && payload?.email) {
        return payload.email;
      }

      throw new BadRequestException();
    } catch (err) {
      if (err?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email verification token is expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }
}
