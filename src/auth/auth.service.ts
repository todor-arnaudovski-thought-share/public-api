import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserDto } from '../models/users/dto/user.dto';
import { mapUserToDto } from '../models/users/mappers/user.mapper';
import { UsersService } from '../models/users/users.service';
import { Tokens } from './interfaces/tokens.interface';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async register(authCredentialsDto: AuthCredentialsDto): Promise<{
    tokens: Tokens;
    userDto: UserDto;
  }> {
    const user = await this.usersService.create(authCredentialsDto);

    if (user) {
      const userDto = mapUserToDto(user);
      const payload: JwtPayload = {
        pubId: user.pubId,
        username: user.username,
      };
      const tokens: Tokens = await this.createTokens(payload);
      await this.hashAndUpdateRtHash(user.pubId, tokens.refresh_token);

      return { tokens, userDto };
    } else {
      throw new InternalServerErrorException();
    }
  }

  async login(authCredentialsDto: AuthCredentialsDto): Promise<{
    tokens: Tokens;
    userDto: UserDto;
  }> {
    const { username, password } = authCredentialsDto;

    const user = await this.usersService.findByUsername(username);

    if (!user?.password)
      throw new UnauthorizedException('Wrong login credentials');

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
      throw new UnauthorizedException('Wrong login credentials');

    const userDto = mapUserToDto(user);
    const payload: JwtPayload = { pubId: user.pubId, username: user.username };
    const tokens: Tokens = await this.createTokens(payload);
    await this.hashAndUpdateRtHash(user.pubId, tokens.refresh_token);

    return { tokens, userDto };
  }

  async logout(pubId: string): Promise<void> {
    await this.usersService.removeRtHash(pubId);
  }

  async refresh(
    pubId: string,
    rt: string,
  ): Promise<{
    tokens: Tokens;
    userDto: UserDto;
  }> {
    const user = await this.usersService.findByPubId(pubId);

    if (!user?.hashedRt) throw new ForbiddenException('Access denied');

    const hashedRt = this.hashData(rt);
    const isRtHashMatch = hashedRt === user.hashedRt;
    if (!isRtHashMatch) throw new ForbiddenException('Access denied');

    const userDto = mapUserToDto(user);
    const payload: JwtPayload = { pubId: user.pubId, username: user.username };
    const tokens: Tokens = await this.createTokens(payload);
    await this.hashAndUpdateRtHash(user.pubId, tokens.refresh_token);

    return { tokens, userDto };
  }

  async hashAndUpdateRtHash(pubId: string, rt: string): Promise<void> {
    const hashedRt = this.hashData(rt);
    await this.usersService.updateRtHash(pubId, hashedRt);
  }

  async createTokens(payload: JwtPayload): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_AT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_AT_EXPIRE'),
      }),
      await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_RT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_RT_EXPIRE'),
      }),
    ]);

    return { access_token: at, refresh_token: rt };
  }

  hashData(data: string) {
    const hashedData = crypto.createHash('sha256').update(data).digest('hex');
    return hashedData;
  }
}
