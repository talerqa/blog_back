import nodemailer from "nodemailer";

export const nodemailerService = {
  async sendEmail(
    email: string,
    code: string,
    template: (code: string) => string
  ): Promise<boolean> {
    let transporter = nodemailer.createTransport({
      host: "smtp.yandex.ru",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
      }
    });

    let info = transporter.sendMail({
      from: `<${process.env.EMAIL}>`,
      to: email,
      subject: "Your code is here",
      html: template(code) // html body
    });

    return !!info;
  }
};
