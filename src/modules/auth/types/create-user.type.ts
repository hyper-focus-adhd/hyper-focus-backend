import { Gender, Language, Role } from '../../../enums/user.enum';

export type CreateUserType = {
  id: string;
  username: string;
  role: Role;
  email: string;
  birthdate: Date;
  gender: Gender;
  nationality: string;
  language: Language;
  profile_image: string;
  accessToken?: string;
  refreshToken?: string;
  created_at: Date;
};
