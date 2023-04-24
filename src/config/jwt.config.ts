import 'dotenv/config';

export const jwtConfig = {
  accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
  accessExpiresIn: process.env.JWT_ACCESS_TIME,
  refreshExpiresIn: process.env.JWT_REFRESH_TIME,
};
