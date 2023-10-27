import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Res,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { User } from '../models/users/schemas/user.schema';
import { UserDto } from '../models/users/dto/user.dto';
import { mapUserToDto } from '../models/users/mappers/user.mapper';
import { JwtAuthGuard, JwtRefreshAuthGuard } from '../common/guards/auth';
import { TokenNames, Tokens } from './interfaces/tokens.interface';
import { GetCurrentUser, GetCurrentUserPubId } from '../common/decorators';
import { setCookie } from '../common/utils';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async verifyUser(@GetCurrentUser() user: User): Promise<UserDto> {
    const userDto = mapUserToDto(user);
    return userDto;
  }

  @Post('register')
  async register(
    @Body() authCredentialsDto: AuthCredentialsDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserDto> {
    const { userDto, tokens } =
      await this.authService.register(authCredentialsDto);

    this.setTokenCookies(res, tokens);

    if (!userDto) throw new InternalServerErrorException();

    return userDto;
  }

  @Post('login')
  async singIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserDto> {
    const { userDto, tokens } =
      await this.authService.login(authCredentialsDto);

    this.setTokenCookies(res, tokens);

    if (!userDto) throw new InternalServerErrorException();

    return userDto;
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
  ): Promise<UserDto> {
    const { userDto, tokens } = await this.authService.refresh(
      pubId,
      refreshToken,
    );

    this.setTokenCookies(res, tokens);

    if (!userDto) throw new InternalServerErrorException();

    return userDto;
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
