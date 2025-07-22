import { transporter } from '../config/email.js';
import fs from 'fs';
import path from 'path';

const loadTemplate = (templateName, variables) => {
  const filePath = path.resolve('templates', templateName);
  let html = fs.readFileSync(filePath, 'utf8');
  Object.entries(variables).forEach(([key, value]) => {
    html = html.replaceAll(`{{${key}}}`, value);
  });
  return html;
};

export const sendEmail = async ({ to, subject, template, variables }) => {
  const html = loadTemplate(template, variables);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html
  };

  return await transporter.sendMail(mailOptions);
};
