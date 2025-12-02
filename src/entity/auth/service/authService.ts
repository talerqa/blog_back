import { randomUUID } from "node:crypto";
import { add } from "date-fns/add";
import { emailExamples } from "../../../core/const/template";
import { User } from "../../user/types/user";
import { UUID } from "crypto";
import { errorsName } from "../../../core/const/errorsName";
import { MutationUsersRepositories } from "../../user/repositories/mutationUsers.repositories";
import { UsersRepositories } from "../../user/repositories/usersRepositories";
import { UserService } from "../../user/application/user.service";
import { NodemailerService } from "./emailService";
import { PasswordService } from "../../../core/utils/passUtils";

export class AuthService {
  constructor(
    private usersRepositories: UsersRepositories,
    private mutationUsersRepositories: MutationUsersRepositories,
    private userService: UserService,
    private nodemailerService: NodemailerService,
    private passwordService: PasswordService
  ) {}

  async login(
    loginOrEmail: string,
    password: string,
    body: { title: string; ip: string }
  ): Promise<{
    refreshToken: string;
    accessToken: string;
  }> {
    const deviceId = randomUUID();
    const body1 = { ...body, deviceId };

    return this.userService.login(loginOrEmail, password, body1);
  }

  async registerUser(
    login: string,
    pass: string,
    email: string
  ): Promise<void> {
    await this.usersRepositories.isExistUserWithLoginOrEmail(login, email);

    const passwordHash = await this.passwordService.generatePassword(pass);
    const code: UUID = randomUUID();
    const newUser: Omit<User, "id"> = {
      login,
      email,
      password: passwordHash,
      createdAt: new Date(),
      emailConfirmation: {
        confirmationCode: code,
        expirationDate: add(new Date(), {
          hours: 1
        }),
        isConfirmed: false
      }
    };

    await this.mutationUsersRepositories.createUserWithConfirmByEmail(newUser);

    try {
      this.nodemailerService.sendEmail(
        email,
        emailExamples.registrationEmail(code)
      );
    } catch (e) {
      console.error("Send email error", e);
    }
  }

  async resending(email: string) {
    const user = await this.usersRepositories.findUserByEmail(email);

    if (user?.emailConfirmation?.isConfirmed) {
      throw new Error(errorsName.wrong_email);
    }

    const code = randomUUID();
    const newDate = add(new Date(), {
      hours: 1
    }).toISOString();

    await this.mutationUsersRepositories.updateEmailConfirmationUser(
      user._id.toString(),
      code,
      newDate
    );

    try {
      this.nodemailerService.sendEmail(
        email,
        emailExamples.registrationEmail(code)
      );
    } catch (e) {
      console.error("Send email error", e);
    }
  }

  async registrationConfirmation(code: string) {
    const user = await this.usersRepositories.findUserByCodeConfirm(code);

    return this.mutationUsersRepositories.updateConfirmCodeUser(
      user._id.toString()
    );
  }

  async refreshToken(userId: string, body: any) {
    return this.userService.refreshToken(userId, body);
  }
}
