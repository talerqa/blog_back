import nodemailer from "nodemailer";

export const nodemailerService = {
  async sendEmail(
    email: string,
    code: string,
    template: string
  ): Promise<boolean> {
    let transporter = nodemailer.createTransport({
      host: "smtp.yandex.ru",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_YANDEX,
        pass: process.env.PASS_YANDEX
      }
    });

    let info = await transporter.sendMail({
      from: `<${process.env.EMAIL_YANDEX}>`,
      to: email,
      subject: "Your code is here",
      html: template
    });

    return !!info;
  }
};
