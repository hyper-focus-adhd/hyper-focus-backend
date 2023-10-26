import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository, UpdateResult } from 'typeorm';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

import { messagesHelper } from '../../common/helpers/messages-helper';
import { jwtConfig } from '../../config/jwt.config';
import { sendgridConfig } from '../../config/sendgrid.config';
import { FileStorageService } from '../../integration/file-storage/file-storage.service';
import { MailerService } from '../../integration/mailer/mailer.service';
import { JwtPayload } from '../auth/types';
import { CommunitiesService } from '../communities/communities.service';
import { Community } from '../communities/entities/community.entity';

import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly fileStorageService: FileStorageService,
    private readonly mailerService: MailerService,
    private readonly communitiesService: CommunitiesService,
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
    hashedPassword: string,
    image: Express.Multer.File,
  ): Promise<User> {
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    if (image) {
      user.profile_image = await this.uploadProfileImage(user.id, image);
    }

    return await this.userRepository.save(user);
  }

  async findAllUsers(): Promise<User[]> {
    const users = await this.userRepository.find();

    if (!users) {
      throw new NotFoundException(messagesHelper.USER_NOT_FOUND);
    }

    return users;
  }

  async findOneUser(options: FindOneOptions<User>): Promise<User> {
    return await this.userRepository.findOne(options);
  }

  async findOneUserOrFail(options: FindOneOptions<User>): Promise<User> {
    try {
      return await this.userRepository.findOneOrFail(options);
    } catch (error: unknown) {
      throw new NotFoundException(messagesHelper.USER_NOT_FOUND);
    }
  }

  async getFollowingByUsername(username: string): Promise<User[]> {
    const user = await this.findOneUserOrFail({
      where: { username: username },
    });

    const followingUsers: User[] = [];

    for (const friend of user.following) {
      const friendData = await this.findOneUserOrFail({
        where: { id: friend },
      });

      followingUsers.push(friendData);
    }

    return followingUsers;
  }

  async getFollowedByUsername(username: string): Promise<User[]> {
    const user = await this.findOneUserOrFail({
      where: { username: username },
    });

    const followedUsers: User[] = [];

    for (const friend of user.followers) {
      const friendData = await this.findOneUserOrFail({
        where: { id: friend },
      });

      followedUsers.push(friendData);
    }

    return followedUsers;
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
    profile_image?: Express.Multer.File,
  ): Promise<User> {
    if (updateUserDto.username || updateUserDto.email) {
      await this.verifyExistingUser(
        updateUserDto.username,
        updateUserDto.email,
      );
    }

    const user = await this.findOneUserOrFail({ where: { id: userId } });

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt(10);
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    if (profile_image) {
      user.profile_image = await this.uploadProfileImage(
        user.id,
        profile_image,
      );
    }

    this.userRepository.merge(user, updateUserDto);

    return await this.userRepository.save(user);
  }

  async removeUser(userId: string): Promise<User> {
    const user = await this.findOneUserOrFail({
      where: { id: userId },
    });

    return await this.userRepository.softRemove(user);
  }

  async restoreUser(userId: string): Promise<UpdateResult> {
    const user = await this.findOneUserOrFail({
      where: { id: userId },
      withDeleted: true,
    });

    return await this.userRepository.restore(user.id);
  }

  async verifyExistingUser(username: string, email: string): Promise<void> {
    const existingUser = await this.findOneUser({
      where: [{ username }, { email }],
      withDeleted: true,
    });

    if (existingUser) {
      if (existingUser.username === username) {
        throw new ConflictException(messagesHelper.USER_EXISTS);
      }
      if (existingUser.email === email) {
        throw new ConflictException(messagesHelper.EMAIL_EXISTS);
      }
    }
  }

  async passwordChange(
    password: string,
    passwordRecoveryToken: string,
  ): Promise<User> {
    const isValidToken = this.validateAndCheckToken(passwordRecoveryToken);

    if (isValidToken === false) {
      throw new UnauthorizedException(messagesHelper.TOKEN_INVALID);
    }

    const decodedToken = this.jwtService.decode(passwordRecoveryToken);
    const userId = decodedToken.sub;

    const user = await this.findOneUserOrFail({
      where: { id: userId },
    });

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    user.password = password;

    return await this.userRepository.save(user);
  }

  validateAndCheckToken(token: string): boolean {
    try {
      const options = { secret: jwtConfig.passwordRecoverySecret };
      const decodedToken = this.jwtService.verify(token, options);

      // Check the expiration time
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (decodedToken.exp && currentTimestamp >= decodedToken.exp) {
        // Token has expired
        return false;
      }

      // Token is valid and not expired
      return true;
    } catch (error) {
      // Token verification failed
      return false;
    }
  }

  async mailUsername(email: string): Promise<void> {
    const user = await this.findOneUserOrFail({
      where: { email },
    });

    await this.mailerService.sendgridMail(
      user.email,
      sendgridConfig.sendgridUsernameTemplateId,
      messagesHelper.SUBJECT_USERNAME_RECOVERY,
      user.username,
    );
  }

  async generatePasswordRecoveryToken(user: User): Promise<string> {
    const jwtPayload: JwtPayload = {
      username: user.username,
      sub: user.id,
    };

    return await this.jwtService.signAsync(jwtPayload, {
      secret: jwtConfig.passwordRecoverySecret,
      expiresIn: jwtConfig.passwordRecoveryExpiresIn,
    });
  }

  async mailPasswordLink(email: string): Promise<void> {
    const user = await this.findOneUserOrFail({
      where: { email },
    });

    const token = await this.generatePasswordRecoveryToken(user);

    await this.mailerService.sendgridMail(
      user.email,
      sendgridConfig.sendgridPasswordTemplateId,
      messagesHelper.SUBJECT_PASSWORD_RECOVERY,
      undefined,
      `${sendgridConfig.sendgridPasswordRecoveryPage}?token=${token}`,
    );
  }

  async uploadProfileImage(
    userId: string,
    image: Express.Multer.File,
  ): Promise<string> {
    const folderName = `users/${userId}/profile-image`;

    return await this.fileStorageService.uploadImage(image, folderName);
  }

  async followUser(
    userId: string,
    followUserId: string,
  ): Promise<{ user: User; followed_user: User }> {
    const user = await this.findOneUserOrFail({ where: { id: userId } });

    const followedUser = await this.findOneUserOrFail({
      where: { id: followUserId },
    });

    const followIndex = user.following.indexOf(followUserId);
    const followedIndex = followedUser.followers.indexOf(user.id);

    if (followIndex === -1) {
      user.following.push(followUserId);
      followedUser.followers.push(user.id);
    } else {
      user.following.splice(followIndex, 1);
      followedUser.followers.splice(followedIndex, 1);
    }

    await this.userRepository.save(followedUser);
    await this.userRepository.save(user);
    return { user, followed_user: followedUser };
  }

  async followCommunity(
    userId: string,
    followCommunityId: string,
  ): Promise<Community> {
    const user = await this.findOneUserOrFail({
      where: { id: userId },
    });

    const community = await this.communitiesService.findOneCommunityOrFail({
      where: { id: followCommunityId },
      relations: ['user'],
    });

    const followIndex = community.followers.indexOf(user.id);

    if (followIndex === -1) {
      community.followers.push(user.id);
    } else {
      community.followers.splice(followIndex, 1);
    }

    await this.communitiesService.updateCommunity(
      community.user.id,
      community.id,
      {
        followers: community.followers,
      },
    );
    return community;
  }
}
