import 'dotenv/config';

export const sendgridConfig = {
  sendgridAccessKey: process.env.SENDGRID_API_KEY,
  sendgridFrom: process.env.SENDGRID_FROM,
  sendgridTemplateId: process.env.SENDGRID_TEMPLATE_ID,
};
