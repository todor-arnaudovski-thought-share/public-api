import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { User } from '../users/user.schema';
import { AuthInterceptor } from './auth.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @UseInterceptors(AuthInterceptor)
  async signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<User> {
    return await this.authService.signUp(authCredentialsDto);
  }

  @Post('signin')
  async singIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{
    accessToken: string;
  }> {
    return await this.authService.signIn(authCredentialsDto);
  }
}
