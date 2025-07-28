import nodemailer from "nodemailer";

export const nodemailerService = {
  async sendEmail(
    email: string,
    code: string,
    template: (code: string) => string
  ): Promise<boolean> {
    let transporter = nodemailer.createTransport({
      host: "smtp.yandex.ru",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
      }
    });

    let info = await transporter.sendMail({
      from: "<tare-aleksei@yandex.ru>",
      to: email,
      subject: "Your code is here",
      html: template(code) // html body
    });

    return !!info;
  }
};
