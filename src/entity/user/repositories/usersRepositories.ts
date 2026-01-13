import { User } from "../types/user";
import { WithId } from "mongodb";
import { errorsName } from "../../../core/const/errorsName";
import { userCollection } from "../../../db/mongo.db";

export class UsersRepositories {
  async isExistUserWithLoginOrEmail(
    login: string,
    email: string
  ): Promise<void> {
    const user = await userCollection.findOne({
      $or: [{ login }, { email }]
    });

    if (!user) return;

    if (user.login === login) {
      throw new Error(errorsName.wrong_login);
    }
    if (user.email === email) {
      throw new Error(errorsName.wrong_email);
    }
  }

  async findUserByCodeConfirm(code: string): Promise<WithId<User>> {
    const user = await userCollection.findOne({
      "emailConfirmation.confirmationCode": code
    });

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

  async findUserByEmailWithChecked(email: string): Promise<WithId<User>> {
    const user = await userCollection.findOne({ email });

    if (!user) {
      throw new Error(errorsName.wrong_email);
    }

    const now = new Date().toISOString();
    if (user?.emailConfirmation.expirationDate < now) {
      throw new Error(errorsName.confirm_code);
    }

    return user;
  }
  async findUserByEmail(email: string): Promise<WithId<User> | null> {
    return userCollection.findOne({ email });
  }

  async findUserByCodePasswordRecovery(code: string): Promise<WithId<User>> {
    const user = await userCollection.findOne({
      "passwordRecovery.recoveryCode": code
    });

    if (!user) {
      throw new Error(errorsName.confirm_code);
    }

    return user;
  }
}
