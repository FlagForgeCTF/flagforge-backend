import nodemailer from "nodemailer";
import { config } from "./config";
import fs from "fs";
import path from "path";
import Handlebars from "handlebars";

export const sendEmail = async (
  email: string,
  subject: string,
  payload: object,
  template: string
):Promise<string> => {
  try {
    const transporter: nodemailer.Transporter = nodemailer.createTransport({
      host: config.HOST,
      service: "gmail",
      port: 587,
      secure: false,
      auth: {
        user: config.USER,
        pass: config.PASSWORD,
      },
    });

    const source = fs.readFileSync(path.join(__dirname, template), "utf-8");
    const compiledTemplate: HandlebarsTemplateDelegate =
      Handlebars.compile(source);

    await transporter.sendMail({
      from: config.USER,
      to: email,
      subject: subject,
      html: compiledTemplate(payload),
    });
    return "Password reset email sent successfully. Please check your inbox.";
  } catch (error) {
    return "Failed to send email for password reset";
  }
};
