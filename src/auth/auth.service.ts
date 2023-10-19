import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthRepository } from './auth.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from '../models/users/schemas/user.schema';
import { UserDto } from '../models/users/dto/user.dto';
import { mapUserToDto } from '../models/users/mappers/user.mapper';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    return this.usersRepository.createUser(authCredentialsDto);
  }

  async login(authCredentialsDto: AuthCredentialsDto): Promise<{
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
