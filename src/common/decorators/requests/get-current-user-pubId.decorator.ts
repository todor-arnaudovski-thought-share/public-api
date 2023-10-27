import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { JwtPayload } from '../../../auth/interfaces/jwt-payload.interface';

export const GetCurrentUserPubId = createParamDecorator(
  (_data, context: ExecutionContext): string => {
    const req = context.switchToHttp().getRequest();
    const user = req?.user as JwtPayload;
    return user?.pubId;
  },
);
