import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { TokenNames } from '../interfaces/tokens.interface';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { JwtPayloadWithRt } from '../interfaces/jwt-payload-with-rt.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtRefreshStrategy.extractRefreshToken,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      passReqToCallback: true,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_RT_SECRET'),
    });
  }

  private static extractRefreshToken(req: Request): string | null {
    if (
      req.cookies &&
      TokenNames.refresh_token in req.cookies &&
      req.cookies.refresh_token.length > 0
    ) {
      return req.cookies.refresh_token;
    } else {
      return null;
    }
  }

  async validate(req: Request, payload: JwtPayload): Promise<JwtPayloadWithRt> {
    const refreshToken = JwtRefreshStrategy.extractRefreshToken(req);

    if (!refreshToken) {
      throw new UnauthorizedException(
        'No refresh token provided in request cookies',
      );
    }

    return { ...payload, refreshToken };
  }
}
