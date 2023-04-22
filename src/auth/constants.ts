import 'dotenv/config';

export const jwtConstants = {
  secret: process.env.JWT_ACCESS_TOKEN_SECRET,
  expiresIn: process.env.JWT_ACCESS_TIME,
};
