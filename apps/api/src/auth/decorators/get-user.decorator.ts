import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../strategies/jwt.strategy';
import type { Request } from 'express';

interface RequestWithUser extends Request {
  user: JwtPayload;
}

export const GetUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const { user } = request;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  },
);
