import { JwtPayload } from './index';

export type JwtPayloadRefreshTokenType = JwtPayload & {
  refreshToken: string;
};
