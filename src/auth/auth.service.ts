import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from '../models/users/schemas/user.schema';
import { UserDto } from '../models/users/dto/user.dto';
import { mapUserToDto } from '../models/users/mappers/user.mapper';
import { UsersService } from '../models/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    return this.usersService.create(authCredentialsDto);
  }

  async login(authCredentialsDto: AuthCredentialsDto): Promise<{
    accessToken: string;
    userDto: UserDto;
  }> {
    const { username, password } = authCredentialsDto;

    const user = await this.usersService.findByUsername(username);

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
