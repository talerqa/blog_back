import { ObjectId, WithId } from "mongodb";
import { userCollection } from "../../../db/mongo.db";
import { CreateUserInputModel } from "../dto/createUserInputModel";
import { User } from "../types/user";
import { randomUUID } from "node:crypto";
import { add } from "date-fns/add";
import { errorsName } from "../../../core/const/errorsName";
import { PasswordService } from "../../../core/utils/passUtils";

export class MutationUsersRepositories {
  constructor(private passwordService: PasswordService) {}

  async createUser(
    dto: CreateUserInputModel
  ): Promise<Omit<User, "password" | "emailConfirmation"> | null> {
    const { login, email, password } = dto;

    const createdAt = new Date().toISOString();
    const passwordHash = await this.passwordService.generatePassword(password);
    const usersResult = await userCollection.insertOne({
      login,
      email,
      password: passwordHash,
      createdAt,
      emailConfirmation: {
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), {
          days: 1
        }),
        isConfirmed: true
      }
    } as WithId<User>);
    const id = usersResult.insertedId;

    const user = await userCollection.findOne({ _id: id });

    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      email: user.email,
      createdAt,
      login: user.login
    };
  }

  async createUserWithConfirmByEmail(
    user: Omit<User, "id">
  ): Promise<WithId<User> | null> {
    const insertResult = await userCollection.insertOne({
      ...user
    } as User);

    const id = insertResult.insertedId.toString();

    const findUser = userCollection.findOne({ _id: new ObjectId(id) });

    if (!findUser) {
      throw Error(errorsName.not_found_user);
    }

    return findUser;
  }

  async deleteUserById(id: string): Promise<boolean> {
    const { deletedCount } = await userCollection.deleteOne({
      _id: new ObjectId(id)
    });
    return !!deletedCount;
  }

  async updateConfirmCodeUser(id: string): Promise<boolean> {
    const user = await userCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { "emailConfirmation.isConfirmed": true } }
    );

    return !(user.matchedCount < 1);
  }

  async updateEmailConfirmationUser(
    id: string,
    code: string,
    newDate: string
  ): Promise<boolean> {
    const user = await userCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          "emailConfirmation.expirationDate": newDate,
          "emailConfirmation.confirmationCode": code
        }
      }
    );

    return !(user.matchedCount < 1);
  }

  async updatePasswordUser(id: string, code: string): Promise<boolean> {
    const user = await userCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          "passwordRecovery.recoveryCode": code
        }
      }
    );

    return !(user.matchedCount < 1);
  }

  async updateUserPassword(id: string, password: string): Promise<boolean> {
    const user = await userCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          password: password
        }
      }
    );

    return !(user.matchedCount < 1);
  }
}
