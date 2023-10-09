import { verify } from 'jsonwebtoken';
import { Socket } from 'socket.io';

import { jwtConfig } from '../../config/jwt.config';

export const SocketAuthMiddleware = () => {
  return (client: Socket, next: (err?: unknown) => void): void => {
    try {
      const { authorization } = client.handshake.headers;
      const token: string = authorization.split(' ')[1];
      verify(token, jwtConfig.accessTokenSecret);
      next();
    } catch (error: unknown) {
      next(error);
    }
  };
};
