import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { Request } from 'express';
import { User } from '../../models/users/schemas/user.schema';
import { UsersService } from '../../models/users/users.service';
import { TokenNames } from '../interfaces/tokens.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractAccessToken, // if we don't have access_token in cookies...
        ExtractJwt.fromAuthHeaderAsBearerToken(), // extract from auth header
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_AT_SECRET'),
    });
  }

  private static extractAccessToken(req: Request): string | null {
    if (
      req.cookies &&
      TokenNames.access_token in req.cookies &&
      req.cookies.access_token.length > 0
    ) {
      return req.cookies.access_token;
    } else {
      return null;
    }
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { pubId } = payload;
    const user: User = await this.usersService.findByPubId(pubId);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
