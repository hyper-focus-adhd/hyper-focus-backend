import { JwtPayload } from '.';

export type JwtPayloadRefreshTokenType = JwtPayload & {
  refreshToken: string;
};
