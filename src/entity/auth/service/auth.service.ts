import { userService } from "../../user/application/user.service";
import { mutationUsersRepositories } from "../../user/repositories/mutationUsers.repositories";
import { generatePassword } from "../../../core/utils/generatePassword";
import { randomUUID } from "node:crypto";
import { add } from "date-fns/add";
import { nodemailerService } from "./emailService";
import { userCollection } from "../../../db/mongo.db";

export const emailExamples = {
  registrationEmail(code: string) {
    return ` <h1>Thank for your registration</h1>
               <p>To finish registration please follow the link below:<br>
                  <a href='https://blog-back-puce.vercel.app/auth/registration-confirmation?code=${code}'>complete registration</a>
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
      await nodemailerService.sendEmail(
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
    const wrongEmail: any = await userCollection.findOne({
      email
    });

    if (!wrongEmail) {
      throw new Error("wrongEmail");
    }

    if (wrongEmail?.emailConfirmation?.isConfirmed) {
      throw new Error("codeAlredyAprove");
    }

    return await nodemailerService
      .sendEmail(
        //отправить сообщение на почту юзера с кодом подтверждения
        email,
        randomUUID(),
        emailExamples.registrationEmail
      )
      .catch(e => {
        console.error("Send email error", e); //залогировать ошибку при отправке сообщения
      });
  },
  async registrationConfirmation(code: string) {
    const isUuid = new RegExp(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    ).test(code);

    if (!isUuid) {
      throw new Error("codeError");
    }

    const correctEmail: any = await userCollection.findOne({
      "emailConfirmation.confirmationCode": code
    });

    if (correctEmail?.emailConfirmation?.isConfirmed) {
      throw new Error("codeAlredyAprove");
    }

    if (!correctEmail) {
      throw new Error("codeError");
    }

    const newUser = await userCollection.updateOne(
      { "emailConfirmation.confirmationCode": code },
      {
        $set: {
          "emailConfirmation.isConfirmed": true
        }
      }
    );

    // if (newUser.matchedCount < 1) {
    //   throw new Error("codeError");
    // }

    const email: any = await userCollection.findOne({
      "emailConfirmation.confirmationCode": code
    });

    const now = new Date();

    if (email?.emailConfirmation?.expirationDate < now) {
      throw new Error("expiredDate");
    }

    return !(newUser.matchedCount < 1);
  }
};
