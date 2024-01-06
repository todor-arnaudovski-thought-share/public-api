import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/auth';
import { EmailConfirmationService } from '../email/email-confirmation.service';
import { ConfirmEmailDto } from './dto/confirm-email.dto';

@Controller('email-confirmation')
export class EmailConfirmation {
  constructor(private emailConfirmationService: EmailConfirmationService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async confirm(@Body() confirmEmailDto: ConfirmEmailDto) {
    console.log('CALL');
    const email = await this.emailConfirmationService.decodeConfirmationToken(
      confirmEmailDto.token,
    );

    await this.emailConfirmationService.confirmEmail(email);

    console.log('[email-confirmation] confirmEmailDto', confirmEmailDto);

    return { isVerified: true };
  }
}
