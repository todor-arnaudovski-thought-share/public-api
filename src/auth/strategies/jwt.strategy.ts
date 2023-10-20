import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { Request } from 'express';
import { User } from '../../models/users/schemas/user.schema';
import { UsersService } from '../../models/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJwt, // if we don't have access_toke in cookies...
        ExtractJwt.fromAuthHeaderAsBearerToken(), // extract from auth header
      ]),
      ignoreExpiration: false,
      secretOrKey: 'jwt-secret',
    });
  }

  private static extractJwt(req: Request): string | null {
    if (
      req.cookies &&
      'access_token' in req.cookies &&
      req.cookies.access_token.length > 0
    ) {
      return req.cookies.access_token;
    } else {
      return null;
    }
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { username } = payload;
    const user: User = await this.usersService.findByUsername(username); // refactor to using pubId instead of username

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
