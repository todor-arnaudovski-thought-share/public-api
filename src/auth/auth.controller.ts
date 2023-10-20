import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  Get,
  Res,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { User } from '../models/users/schemas/user.schema';
import { UserDto } from '../models/users/dto/user.dto';
import { mapUserToDto } from '../models/users/mappers/user.mapper';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard())
  @Get('user')
  async verifyUser(@Req() req: Request): Promise<UserDto> {
    const user = req?.user as User;
    const userDto = mapUserToDto(user);
    return userDto;
  }

  @Post('signup')
  async register(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<User> {
    return await this.authService.register(authCredentialsDto);
  }

  @Post('login')
  async singIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserDto> {
    const signedInUser = await this.authService.login(authCredentialsDto);
    res.cookie('access_token', signedInUser.accessToken, {
      expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      httpOnly: true,
    });
    return signedInUser.userDto;
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response): Promise<void> {
    res.cookie('access_token', null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    return null;
  }
}
