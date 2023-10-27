import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from '../../../models/users/schemas/user.schema';
import { JwtPayloadWithRt } from '../../../auth/interfaces/jwt-payload-with-rt.interface';

export const GetCurrentUser = createParamDecorator(
  (data: keyof JwtPayloadWithRt, context: ExecutionContext): User => {
    const req = context.switchToHttp().getRequest();
    if (!data) return req?.user;
    return req?.user[data];
  },
);
