import 'dotenv/config';

export const sendgridConfig = {
  sendgridAccessKey: process.env.SENDGRID_API_KEY,
  sendgridFrom: process.env.SENDGRID_FROM,
  sendgridUsernameTemplateId: process.env.SENDGRID_USERNAME_TEMPLATE_ID,
  sendgridPasswordTemplateId: process.env.SENDGRID_PASSWORD_TEMPLATE_ID,
  sendgridPasswordRecoveryPage: process.env.SENDGRID_PASSWORD_RECOVERY_PAGE,
};
