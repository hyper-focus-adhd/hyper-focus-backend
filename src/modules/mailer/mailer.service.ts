import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as sendgridMail from '@sendgrid/mail';

import { jwtConfig } from '../../config/jwt.config';
import { sendgridConfig } from '../../config/sendgrid.config';
import { messagesHelper } from '../../helpers/messages-helper';
import { JwtPayload } from '../auth/types';
import { User } from '../users/entities/user.entity';
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
    const user = await this.usersService.findOneUserOrFail({
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
    const user = await this.usersService.findOneUserOrFail({
      where: { email },
    });

    const token = await this.generatePasswordRecoveryToken(user);

    await sendgridMail.send({
      from: sendgridConfig.sendgridFrom,
      to: user.email,
      templateId: sendgridConfig.sendgridPasswordTemplateId,
      dynamicTemplateData: {
        subject: messagesHelper.SUBJECT_PASSWORD_RECOVERY,
        link: `${sendgridConfig.sendgridPasswordRecoveryPage}?token=${token}`,
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
}
