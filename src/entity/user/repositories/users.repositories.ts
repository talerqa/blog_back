import { userCollection } from "../../../db/mongo.db";
import { User } from "../types/user";
import { WithId } from "mongodb";
import { errorsName } from "../../../core/const/errorsName";

export const usersRepositories = {
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
  },
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
    const now = new Date();
    if (user?.emailConfirmation.expirationDate < now) {
      throw new Error(errorsName.confirm_code);
    }

    return user;
  },
  async findUserByEmail(email: string): Promise<WithId<User>> {
    const user = await userCollection.findOne({ email });

    if (!user) {
      throw new Error(errorsName.wrong_email);
    }

    const now = new Date();
    if (user?.emailConfirmation.expirationDate < now) {
      throw new Error(errorsName.confirm_code);
    }

    return user;
  }
};
