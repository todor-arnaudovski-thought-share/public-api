import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthRepository } from './auth.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { User } from 'src/users/user.schema';
import { UserDto } from 'src/users/dto/user.dto';
import { mapUserToDto } from 'src/users/user.mapper';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    return this.usersRepository.createUser(authCredentialsDto);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{
    accessToken: string;
    userDto: UserDto;
  }> {
    const { username, password } = authCredentialsDto;

    const user = await this.usersRepository.findUserByUsername(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      const userDto = mapUserToDto(user);
      const payload: JwtPayload = { pubId: user.pubId, username };
      const accessToken: string = await this.jwtService.signAsync(payload);
      return { accessToken, userDto };
    } else {
      throw new UnauthorizedException('Wrong login credentials');
    }
  }
}
