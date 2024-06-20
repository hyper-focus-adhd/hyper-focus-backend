import { GenderEnum, LanguageEnum, RoleEnum } from '../../users/enums/user.enum';

export type CreateUserType = {
  id: string;
  username: string;
  role: RoleEnum;
  email: string;
  birthdate: Date;
  gender: GenderEnum;
  nationality: string;
  language: LanguageEnum;
  profile_image: string;
  accessToken?: string;
  refreshToken?: string;
  created_at: Date;
};
