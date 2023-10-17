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
import { User } from '../users/user.schema';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { UserDto } from 'src/users/dto/user.dto';
import { mapUserToDto } from 'src/users/user.mapper';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<User> {
    return await this.authService.signUp(authCredentialsDto);
  }

  @Post('signin')
  async singIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserDto> {
    const signedInUser = await this.authService.signIn(authCredentialsDto);
    res.cookie('access_token', signedInUser.accessToken, {
      expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      httpOnly: true,
    });
    return signedInUser.userDto;
  }

  @UseGuards(AuthGuard())
  @Get('user')
  async verifyUser(@Req() req: Request): Promise<UserDto> {
    const user = req?.user as User;
    const userDto = mapUserToDto(user);
    return userDto;
  }
}
