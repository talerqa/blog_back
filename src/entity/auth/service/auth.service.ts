import { userService } from "../../user/application/user.service";
import { mutationUsersRepositories } from "../../user/repositories/mutationUsers.repositories";
import { generatePassword } from "../../../core/utils/generatePassword";
import { randomUUID } from "node:crypto";
import { add } from "date-fns/add";
import { nodemailerService } from "./emailService";
import { usersRepositories } from "../../user/repositories/users.repositories";
import { emailExamples } from "../../../core/const/template";
import { User } from "../../user/types/user";
import { UUID } from "crypto";
import { errorsName } from "../../../core/const/errorsName";

export const authService = {
  async login(loginOrEmail: string, password: string): Promise<string> {
    return userService.login(loginOrEmail, password);
  },

  async registerUser(
    login: string,
    pass: string,
    email: string
  ): Promise<void> {
    await usersRepositories.isExistUserWithLoginOrEmail(login, email);

    const passwordHash = await generatePassword(pass);
    const code: UUID = randomUUID();
    const newUser: Omit<User, "id"> = {
      login,
      email,
      password: passwordHash,
      createdAt: new Date(),
      emailConfirmation: {
        confirmationCode: code,
        expirationDate: add(new Date(), {
          days: 1
        }),
        isConfirmed: false
      }
    };

    await mutationUsersRepositories.createUserWithConfirmByEmail(newUser);

    try {
      nodemailerService.sendEmail(email, emailExamples.registrationEmail(code));
    } catch (e) {
      console.error("Send email error", e); //залогировать ошибку при отправке сообщения
    }
  },

  async resending(email: string) {
    const user = await usersRepositories.findUserByEmail(email);

    if (user?.emailConfirmation?.isConfirmed) {
      throw new Error(errorsName.wrong_email);
    }

    const code = randomUUID();
    const newDate = add(new Date(), {
      days: 1
    }).toISOString();

    await mutationUsersRepositories.updateEmailConfirmationUser(
      user._id.toString(),
      code,
      newDate
    );

    try {
      nodemailerService.sendEmail(email, emailExamples.registrationEmail(code));
    } catch (e) {
      console.error("Send email error", e);
    }
  },
  async registrationConfirmation(code: string) {
    const user = await usersRepositories.findUserByCodeConfirm(code);

    const isConfirm = await mutationUsersRepositories.updateConfirmCodeUser(
      user._id.toString()
    );

    return isConfirm;
  }
};
