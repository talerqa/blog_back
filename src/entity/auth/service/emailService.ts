import nodemailer from "nodemailer";

export const nodemailerService = {
  async sendEmail(
    email: string,
    code: string,
    template: string
  ): Promise<boolean> {
    let transporter = nodemailer.createTransport({
      //  host: "smtp.yandex.ru",
      service: "smtp.ethereal.email",
      // port: 587,
      // secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
      }
    });

    let info = await transporter.sendMail({
      from: `<${process.env.EMAIL}>`,
      to: email,
      subject: "Your code is here",
      html: template // html body
    });

    return !!info;
  }
};
