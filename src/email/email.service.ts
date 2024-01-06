import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';

// configService.get<string>('EMAIL_SERVICE')

@Injectable()
export class EmailService {
  private nodemailerTransport: Mail;

  constructor(private readonly configService: ConfigService) {
    this.nodemailerTransport = createTransport({
      service: 'gmail',
      host: `smtp.gmail.com`,
      port: 587,
      secure: false,
      auth: {
        user: configService.get<string>('EMAIL_USER'),
        pass: configService.get<string>('EMAIL_APP_PASSWORD'),
      },
    });
  }

  async sendMail(options: Mail.Options) {
    try {
      await this.nodemailerTransport.sendMail(options);
      console.log('successfully sent email!');
      return true;
    } catch (err) {
      console.error('Error sending email', err);
      throw new InternalServerErrorException('Error sending email');
    }
  }
}
