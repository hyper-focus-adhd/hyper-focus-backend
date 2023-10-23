import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { Socket } from 'socket.io';

import { jwtConfig } from '../../config/jwt.config';
import { JwtPayload } from '../../core/auth/types';

export const CurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): string => {
    if (context.getType() === 'ws') {
      const client = context.switchToWs().getClient<Socket>();

      // to test with postman
      const { authorization } = client.handshake.headers;

      // TODO verify if it's really needed
      // to use with a real client
      // const { authorization } = client.handshake.auth;

      const token: string = authorization.split(' ')[1];
      const payload = verify(token, jwtConfig.accessTokenSecret);

      return <string>payload.sub;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    return user.sub;
  },
);
