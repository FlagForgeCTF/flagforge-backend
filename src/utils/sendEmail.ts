import mailgun from "mailgun-js";
import { config } from "./config";
import fs from "fs";
import path from "path";
import Handlebars from "handlebars";

export const sendEmail = async (
  email: string,
  subject: string,
  payload: object,
  template: string
): Promise<string> => {
  try {
    const mg = mailgun({
      apiKey: config.MAILGUN_API_KEY,
      domain: config.MAILGUN_DOMAIN,
    });

    const source = fs.readFileSync(path.join(__dirname, template), "utf-8");
    const compiledTemplate: HandlebarsTemplateDelegate =
      Handlebars.compile(source);
    const htmlContent = compiledTemplate(payload);

    const mailOptions = {
      from: `<no-reply@${config.MAILGUN_DOMAIN}>`,
      to: email,
      subject: subject,
      html: htmlContent,
    };

    // Send email using Mailgun
    await mg.messages().send(mailOptions);

    return "Password reset email sent successfully. Please check your inbox.";
  } catch (error) {
    return "Failed to send email for password reset.";
  }
};
