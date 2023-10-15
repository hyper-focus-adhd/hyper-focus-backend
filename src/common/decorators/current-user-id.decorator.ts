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
      // const { authorization } = client.handshake.headers;
      // to use with a real client
      const { authorization } = client.handshake.auth;

      const token: string = authorization.split(' ')[1];
      const payload = verify(token, jwtConfig.accessTokenSecret);

      // const payloadTestUserA = verify(
      //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMUhBMkhFQzZYMjQ2TUc0NFlCWkg5MVpUUCIsInVzZXJuYW1lIjoiYmFraSIsImlhdCI6MTY5NzQwMDQwMywiZXhwIjoxNjk3NDg2ODAzfQ.fd6sfj8lezn_oC8uZhrhE9qRz1rvqktSucT09upTIUU',
      //   jwtConfig.accessTokenSecret,
      // );
      // const payloadTestUserB = verify(
      //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMUhBSlFSTVgxWDNNOENITVZWSzRFWTJSTSIsInVzZXJuYW1lIjoiYmFraTEiLCJpYXQiOjE2OTc0MDIzNTMsImV4cCI6MTY5NzQ4ODc1M30.KUVOEIjHeKuoynKE3XGp5qCzv9xXCv768Y_rlEhklVY',
      //   jwtConfig.accessTokenSecret,
      // );

      return <string>payload.sub;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    return user.sub;
  },
);
