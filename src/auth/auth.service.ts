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

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
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
    // const isRtMatch = await bcrypt.compare(rt, user.hashedRt);
    const isRtHashMatch = hashedRt === user.hashedRt;
    if (!isRtHashMatch) throw new ForbiddenException('Access denied');

    const userDto = mapUserToDto(user);
    const payload: JwtPayload = { pubId: user.pubId, username: user.username };
    const tokens: Tokens = await this.createTokens(payload);
    await this.hashAndUpdateRtHash(user.pubId, tokens.refresh_token);

    return { tokens, userDto };
  }

  async hashAndUpdateRtHash(pubId: string, rt: string): Promise<void> {
    // const hashedRt = await bcrypt.hash(rt, 10);
    const hashedRt = this.hashData(rt);
    await this.usersService.updateRtHash(pubId, hashedRt);
  }

  async createTokens(payload: JwtPayload): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      await this.jwtService.signAsync(payload, {
        secret: 'jwt-secret',
        expiresIn: '15sec',
      }),
      await this.jwtService.signAsync(payload, {
        secret: 'jwt-refresh-secret',
        expiresIn: '7d',
      }),
    ]);

    return { access_token: at, refresh_token: rt };
  }

  hashData(data: string) {
    const hashedData = crypto.createHash('sha256').update(data).digest('hex');
    return hashedData;
  }
}
