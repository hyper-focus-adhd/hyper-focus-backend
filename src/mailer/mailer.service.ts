import { Injectable } from '@nestjs/common';
import * as sendgridMail from '@sendgrid/mail';

import { sendgridConfig } from '../config/sendgrid.config';
import { messagesHelper } from '../helpers/messages-helper';
import { UsersService } from '../users/users.service';

@Injectable()
export class MailerService {
  constructor(private readonly usersService: UsersService) {
    sendgridMail.setApiKey(sendgridConfig.sendgridAccessKey);
  }

  async mailUsername(email: string) {
    const user = await this.usersService.findOneOrFail({
      where: { email },
    });

    await sendgridMail.send({
      from: sendgridConfig.sendgridFrom,
      to: user.email,
      templateId: sendgridConfig.sendgridTemplateId,
      dynamicTemplateData: {
        subject: messagesHelper.SUBJECT_USERNAME_RECOVERY,
        username: user.username,
      },
    });
  }

  async mailPasswordLink(email: string) {
    const user = await this.usersService.findOneOrFail({
      where: { email },
    });

    await sendgridMail.send({
      from: sendgridConfig.sendgridFrom,
      to: user.email,
      templateId: sendgridConfig.sendgridTemplateId,
      dynamicTemplateData: {
        subject: messagesHelper.SUBJECT_PASSWORD_RECOVERY,
        link: user.username,
      },
    });

    return user;
  }
}
