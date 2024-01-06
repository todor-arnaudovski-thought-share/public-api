import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Res,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { User } from '../models/users/schemas/user.schema';
import { UserPublicDto } from '../models/users/dto/user-public.dto';
import { mapUserToDto } from '../models/users/mappers/user.mapper';
import { JwtAuthGuard, JwtRefreshAuthGuard } from '../common/guards/auth';
import { TokenNames, Tokens } from './interfaces/tokens.interface';
import { GetCurrentUser, GetCurrentUserPubId } from '../common/decorators';
import { setCookie } from '../common/utils';
import { ConfigService } from '@nestjs/config';
import { LoginUserDto, RegisterUserDto } from './dto';
import { EmailConfirmationService } from '../email/email-confirmation.service';

@Controller('auth')
export class AuthController {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private emailConfirmationService: EmailConfirmationService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async verifyUser(@GetCurrentUser() user: User): Promise<UserPublicDto> {
    const UserPublicDto = mapUserToDto(user);
    return UserPublicDto;
  }

  @Post('register')
  async register(
    @Body() registerUserDto: RegisterUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserPublicDto> {
    const { UserPublicDto, tokens } =
      await this.authService.register(registerUserDto);

    // TODO: maybe check if user exists first before attempting to send mail and
    // create the user after successfully seding the verification mail
    await this.emailConfirmationService.sendVerificationLink(
      registerUserDto.email,
    );

    this.setTokenCookies(res, tokens);

    if (!UserPublicDto) throw new InternalServerErrorException();

    return UserPublicDto;
  }

  @Post('login')
  async singIn(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserPublicDto> {
    const { UserPublicDto, tokens } =
      await this.authService.login(loginUserDto);

    this.setTokenCookies(res, tokens);

    if (!UserPublicDto) throw new InternalServerErrorException();

    return UserPublicDto;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @GetCurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.authService.logout(user.pubId);

    this.setExpiredTokenCookies(res);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  async refresh(
    @GetCurrentUserPubId() pubId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserPublicDto> {
    const { UserPublicDto, tokens } = await this.authService.refresh(
      pubId,
      refreshToken,
    );

    this.setTokenCookies(res, tokens);

    if (!UserPublicDto) throw new InternalServerErrorException();

    return UserPublicDto;
  }

  private setTokenCookies(res: Response, tokens: Tokens): void {
    const { access_token: at, refresh_token: rt } = tokens;
    const atMaxAge = this.configService.get<number>('AT_COOKIE_EXPIRE') * 1000;
    const rtMaxAge = this.configService.get<number>('RT_COOKIE_EXPIRE') * 1000;
    setCookie(res, TokenNames.access_token, at, atMaxAge);
    setCookie(res, TokenNames.refresh_token, rt, rtMaxAge);
  }

  private setExpiredTokenCookies(res: Response): void {
    setCookie(res, TokenNames.access_token);
    setCookie(res, TokenNames.refresh_token);
  }
}
