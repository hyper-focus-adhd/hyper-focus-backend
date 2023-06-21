import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';

import { UsersService } from '../users/users.service';

import { AuthService } from './auth.service';

// describe('AuthService', () => {
//   let service: AuthService;
//
//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [AuthService],
//     }).compile();
//
//     service = module.get<AuthService>(AuthService);
//   });
//
//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AuthService, UsersService, JwtService],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    usersService = moduleRef.get<UsersService>(UsersService);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  describe('signUp', () => {
    it('should create a new user and return user details', async () => {
      const createUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword',
      };
      const createUserType = {
        id: '1',
        username: 'testuser',
        role: 'user',
        email: 'test@example.com',
        birthdate: '1990-01-01',
        gender: 'male',
        nationality: 'US',
        language: 'en',
        profile_picture: 'profile.jpg',
        created_at: '2023-06-21T00:00:00Z',
      };

      const verifyExistingUserSpy = jest
        .spyOn(usersService, 'verifyExistingUser')
        .mockResolvedValueOnce(undefined);
      const bcryptGenSaltSpy = jest
        .spyOn(bcrypt, 'genSalt')
        .mockResolvedValueOnce('salt');
      const bcryptHashSpy = jest
        .spyOn(bcrypt, 'hash')
        .mockResolvedValueOnce('hashedPassword');
      const createUserSpy = jest
        .spyOn(usersService, 'createUser')
        .mockResolvedValueOnce(undefined);
      const validateUserSpy = jest
        .spyOn(authService, 'validateUser')
        .mockResolvedValueOnce(createUserType);

      const result = await authService.signUp(createUserDto);

      expect(verifyExistingUserSpy).toHaveBeenCalledWith(
        'testuser',
        'test@example.com',
      );
      expect(bcryptGenSaltSpy).toHaveBeenCalledWith(10);
      expect(bcryptHashSpy).toHaveBeenCalledWith('testpassword', 'salt');
      expect(createUserSpy).toHaveBeenCalledWith(
        createUserDto,
        'hashedPassword',
      );
      expect(validateUserSpy).toHaveBeenCalledWith('testuser', 'testpassword');
      expect(result).toEqual(createUserType);
    });
  });
});
