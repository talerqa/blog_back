import { userService } from "../../user/application/user.service";
import { mutationUsersRepositories } from "../../user/repositories/mutationUsers.repositories";
import { generatePassword } from "../../../core/utils/generatePassword";
import { randomUUID } from "node:crypto";
import { add } from "date-fns/add";
import { nodemailerService } from "./emailService";
import { userCollection } from "../../../db/mongo.db";

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

    const newUser: any = {
      login,
      email,
      password: passwordHash,
      createdAt: new Date(),
      emailConfirmation: {
        // доп поля необходимые для подтверждения
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 30
        }),
        isConfirmed: false
      }
    };
    await mutationUsersRepositories.createUserWithEmailConfirm(newUser); // сохранить
    // юзера в базе данных

    //отправку сообщения лучше обернуть в try-catch, чтобы при ошибке(например отвалиться
    // отправка) приложение не падало
    try {
      nodemailerService.sendEmail(
        //отправить сообщение на почту юзера с кодом подтверждения
        newUser.email,
        newUser.emailConfirmation.confirmationCode,
        emailExamples.registrationEmail
      );
    } catch (e) {
      console.error("Send email error", e); //залогировать ошибку при отправке сообщения
    }
    return newUser;
  },

  async resending(email: any) {
    const findEmail: any = await userCollection.findOne({
      email
    });

    if (!findEmail) {
      throw new Error("wrongEmail");
    }

    if (findEmail?.emailConfirmation?.isConfirmed) {
      throw new Error("codeAlredyAprove");
    }

    const now = new Date();

    if (findEmail?.emailConfirmation?.expirationDate < now) {
      throw new Error("expiredDate");
    }

    try {
      nodemailerService.sendEmail(
        //отправить сообщение на почту юзера с кодом подтверждения
        email,
        randomUUID(),
        emailExamples.registrationEmail
      );
    } catch (e) {
      console.error("Send email error", e); //залогировать ошибку при отправке сообщения
    }

    return findEmail;
  },
  async registrationConfirmation(code: string) {
    // const isUuid = new RegExp(
    //   /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    // ).test(code);
    //
    // if (!isUuid) {
    //   throw new Error("codeError");
    // }

    const correctEmail: any = await userCollection.findOne({
      "emailConfirmation.confirmationCode": code
    });

    if (!correctEmail) {
      throw new Error("codeError");
    }

    if (correctEmail?.emailConfirmation?.isConfirmed) {
      throw new Error("codeAlredyAprove");
    }

    const now = new Date();

    if (correctEmail?.emailConfirmation?.expirationDate < now) {
      throw new Error("expiredDate");
    }

    const newUser = await userCollection.updateOne(
      { "emailConfirmation.confirmationCode": code },
      {
        $set: {
          "emailConfirmation.isConfirmed": true
        }
      }
    );

    return !(newUser.matchedCount < 1);
  }
};
