import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { JwtPayloadRefreshTokenType } from '../../modules/auth/types';

export const CurrentUser = createParamDecorator(
  (
    data: keyof JwtPayloadRefreshTokenType | undefined,
    context: ExecutionContext,
  ) => {
    const request = context.switchToHttp().getRequest();
    if (!data) return request.user;
    return request.user[data];
  },
);
