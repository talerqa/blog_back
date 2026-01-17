import { User } from "../types/user";
import { errorsName } from "../../../core/const/errorsName";
import { UserModel } from "../domain/dto/user.entity";

export class UsersRepositories {
  async isExistUserWithLoginOrEmail(
    login: string,
    email: string
  ): Promise<void> {
    const user = (await UserModel.findOne({
      $or: [{ login }, { email }]
    })) as User;

    if (!user) return;

    if (user.login === login) {
      throw new Error(errorsName.wrong_login);
    }
    if (user.email === email) {
      throw new Error(errorsName.wrong_email);
    }
  }

  async findUserByCodeConfirm(code: string): Promise<User> {
    const user = (await UserModel.findOne({
      "emailConfirmation.confirmationCode": code
    })) as User;

    if (!user) {
      throw new Error(errorsName.confirm_code);
    }
    if (user?.emailConfirmation?.isConfirmed) {
      throw new Error(errorsName.confirm_code);
    }
    const now = new Date().toISOString();
    if (user?.emailConfirmation?.expirationDate < now) {
      throw new Error(errorsName.confirm_code);
    }

    return user;
  }

  async findUserByEmailWithChecked(email: string): Promise<User> {
    const user = (await UserModel.findOne({ email })) as User;

    if (!user) {
      throw new Error(errorsName.wrong_email);
    }

    const now = new Date().toISOString();
    if (user?.emailConfirmation.expirationDate < now) {
      throw new Error(errorsName.confirm_code);
    }

    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return (await UserModel.findOne({ email })) as User;
  }

  async findUserByCodePasswordRecovery(code: string): Promise<User> {
    const user = (await UserModel.findOne({
      "passwordRecovery.recoveryCode": code
    })) as User;

    if (!user) {
      throw new Error(errorsName.confirm_code);
    }

    return user;
  }
}
