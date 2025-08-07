import { userService } from "../../user/application/user.service";
import { mutationUsersRepositories } from "../../user/repositories/mutationUsers.repositories";
import { generatePassword } from "../../../core/utils/generatePassword";
import { randomUUID } from "node:crypto";
import { add } from "date-fns/add";
import { nodemailerService } from "./emailService";

export const emailExamples = {
  registrationEmail(code: string) {
    return `<h1>Thank for your registration</h1>
               <p>To finish registration please follow the link below:<br>
                  <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
              </p>`;
  }
  // passwordRecoveryEmail(code: string) {
  //   return `<h1>Password recovery</h1>
  //       <p>To finish password recovery please follow the link below:
  //           <a href='https://somesite.com/password-recovery?recoveryCode=${code}'>recovery
  // password</a> </p>`; }
};

export const authService = {
  async login(loginOrEmail: string, password: string): Promise<boolean | null> {
    return userService.login(loginOrEmail, password);
  },

  async registerUser(
    login: string,
    pass: string,
    email: string
  ): Promise<any | null> {
    await mutationUsersRepositories.existUserOrEmail(login, email);

    const passwordHash = await generatePassword(pass);
    const confirmationCode = randomUUID();
    const newUser: any = {
      login,
      email,
      password: passwordHash,
      createdAt: new Date(),
      emailConfirmation: {
        // доп поля необходимые для подтверждения
        confirmationCode,
        expirationDate: add(new Date(), {
          days: 1
        }),
        isConfirmed: false
      }
    };
    const user: any = await mutationUsersRepositories.createUserWithEmailConfirm(
      newUser
    );

    const template = `<h1>Thank for your registration</h1>
               <p>To finish registration please follow the link below:<br>
                  <a href='https://somesite.com/confirm-email?code=${user.emailConfirmation.confirmationCode}'>complete registration</a>
              </p>`;

    try {
      nodemailerService.sendEmail(
        //отправить сообщение на почту юзера с кодом подтверждения
        user.email,
        user.emailConfirmation.confirmationCode,
        template
      );
    } catch (e) {
      console.error("Send email error", e); //залогировать ошибку при отправке сообщения
    }
    return user;
  },

  async resending(email: any) {
    const findEmail: any = await mutationUsersRepositories.findUserByEmail(
      email
    );

    if (!findEmail) {
      throw new Error("wrongEmail");
    }

    if (findEmail?.emailConfirmation?.isConfirmed) {
      throw new Error("wrongEmail");
    }

    // const now = new Date();
    //
    // if (findEmail?.emailConfirmation.expirationDate < now) {
    //   throw new Error("wrongEmail");
    // }
    const code = randomUUID();

    const template = `<h1>Thank for your registration</h1>
               <p>To finish registration please follow the link below:<br>
                  <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
              </p>`;

    try {
      nodemailerService.sendEmail(email, code, template);
      console.log(`Sending email to ${email} with code: ${code}`);
    } catch (e) {
      console.error("Send email error", e); //залогировать ошибку при отправке сообщения
    }

    return findEmail;
  },
  async registrationConfirmation(code: string) {
    const correctEmail: any = await mutationUsersRepositories.findUserByCodeConfirm(
      code
    );
    if (!correctEmail) {
      throw new Error("codeError");
    }

    if (correctEmail?.emailConfirmation.isConfirmed) {
      throw new Error("codeError");
    }

    const now = new Date();

    if (correctEmail?.emailConfirmation.expirationDate < now) {
      throw new Error("codeError");
    }

    const newUser = await mutationUsersRepositories.updateConfirmCodeUser(code);

    return !(newUser.matchedCount < 1);
  }
};
