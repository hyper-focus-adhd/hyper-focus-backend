import { Injectable } from '@nestjs/common';
import * as sendgridMail from '@sendgrid/mail';

import { sendgridConfig } from '../../config/sendgrid.config';

@Injectable()
export class MailerService {
  constructor() {
    sendgridMail.setApiKey(sendgridConfig.sendgridAccessKey);
  }

  async sendgridMail(
    to: string,
    templateId: string,
    subject: string,
    username?: string,
    link?: string,
  ): Promise<void> {
    await sendgridMail.send({
      from: sendgridConfig.sendgridFrom,
      to,
      templateId,
      dynamicTemplateData: {
        subject,
        username,
        link,
      },
    });
  }
}
