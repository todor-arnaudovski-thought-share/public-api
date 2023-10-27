import { JwtPayload } from './jwt-payload.interface';

export interface JwtPayloadWithRt extends JwtPayload {
  refreshToken: string;
}
