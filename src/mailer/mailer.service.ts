import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as sendgridMail from '@sendgrid/mail';
import * as argon2 from 'argon2';

import { JwtPayload } from '../auth/types';
import { jwtConfig } from '../config/jwt.config';
import { sendgridConfig } from '../config/sendgrid.config';
import { messagesHelper } from '../helpers/messages-helper';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class MailerService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    sendgridMail.setApiKey(sendgridConfig.sendgridAccessKey);
  }

  async mailUsername(email: string): Promise<void> {
    const user = await this.usersService.findOneOrFail({
      where: { email },
    });

    await sendgridMail.send({
      from: sendgridConfig.sendgridFrom,
      to: user.email,
      templateId: sendgridConfig.sendgridUsernameTemplateId,
      dynamicTemplateData: {
        subject: messagesHelper.SUBJECT_USERNAME_RECOVERY,
        username: user.username,
      },
    });
  }

  async mailPasswordLink(email: string): Promise<void> {
    const user = await this.usersService.findOneOrFail({
      where: { email },
    });

    const token = await this.generatePasswordRecoveryToken(user);

    const passwordRecoveryToken = await this.updatePasswordRecoveryTokenHash(
      user,
      token,
    );

    await sendgridMail.send({
      from: sendgridConfig.sendgridFrom,
      to: user.email,
      templateId: sendgridConfig.sendgridPasswordTemplateId,
      dynamicTemplateData: {
        subject: messagesHelper.SUBJECT_PASSWORD_RECOVERY,
        link: `${sendgridConfig.sendgridPasswordRecoveryPage}/?token=${passwordRecoveryToken}`,
      },
    });
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

  async updatePasswordRecoveryTokenHash(
    user: User,
    passwordRecoveryToken: string,
  ): Promise<string> {
    const hashedPasswordRecoveryToken = await argon2.hash(
      passwordRecoveryToken,
    );

    await this.usersService.update(user.id, {
      hashedPasswordRecoveryToken: hashedPasswordRecoveryToken,
    });

    return hashedPasswordRecoveryToken;
  }
}
