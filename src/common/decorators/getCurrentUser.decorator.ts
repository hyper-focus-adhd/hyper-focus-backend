import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { JwtPayloadRefreshTokenType } from '../../auth/types';

export const GetCurrentUser = createParamDecorator(
  (
    data: keyof JwtPayloadRefreshTokenType | undefined,
    context: ExecutionContext,
  ) => {
    const request = context.switchToHttp().getRequest();
    if (!data) return request.user;
    return request.user[data];
  },
);
