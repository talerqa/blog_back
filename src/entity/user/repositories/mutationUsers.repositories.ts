import { CreateUserInputModel } from "../dto/createUserInputModel";
import { User } from "../types/user";
import { randomUUID } from "node:crypto";
import { add } from "date-fns/add";
import { errorsName } from "../../../core/const/errorsName";
import { PasswordService } from "../../../core/utils/passUtils";
import { UserDocument, UserModel } from "../domain/dto/user.entity";

export class MutationUsersRepositories {
  constructor(private passwordService: PasswordService) {}

  async createUser(
    dto: CreateUserInputModel
  ): Promise<Omit<
    User,
    "password" | "emailConfirmation" | "passwordRecovery"
  > | null> {
    const { login, email, password } = dto;

    const createdAt = new Date().toISOString();
    const passwordHash = await this.passwordService.generatePassword(password);
    const usersResult: UserDocument = await new UserModel({
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
    } as User);
    await usersResult.save();
    const id = usersResult._id;

    const user = (await UserModel.findById(id)) as User;

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      createdAt,
      login: user.login
    };
  }

  async createUserWithConfirmByEmail(
    user: Omit<User, "id">
  ): Promise<User | null> {
    const insertResult: UserDocument = await new UserModel({
      ...user
    } as User);
    await insertResult.save();

    const id = insertResult._id;

    const findUser = (await UserModel.findById(id)) as User;

    if (!findUser) {
      throw Error(errorsName.not_found_user);
    }

    return findUser;
  }

  async deleteUserById(id: string): Promise<boolean> {
    const deletedUser = await UserModel.findByIdAndDelete(id);
    return deletedUser !== null;
  }

  async updateConfirmCodeUser(id: string): Promise<boolean> {
    const user = await UserModel.findByIdAndUpdate(
      id,
      { $set: { "emailConfirmation.isConfirmed": true } },
      { new: true }
    );

    return user !== null;
  }

  async updateEmailConfirmationUser(
    id: string,
    code: string,
    newDate: string
  ): Promise<boolean> {
    const user = await UserModel.findByIdAndUpdate(
      id,
      {
        $set: {
          "emailConfirmation.expirationDate": newDate,
          "emailConfirmation.confirmationCode": code
        }
      },
      { new: true }
    );

    return user !== null;
  }

  async updatePasswordUser(id: string, code: string): Promise<boolean> {
    const user = await UserModel.findByIdAndUpdate(
      id,
      {
        $set: {
          "passwordRecovery.recoveryCode": code
        }
      },
      { new: true }
    );
    return user !== null;
  }

  async updateUserPassword(id: string, password: string): Promise<boolean> {
    const user = await UserModel.findByIdAndUpdate(
      id,
      {
        $set: {
          password: password
        }
      },
      { new: true }
    );

    return user !== null;
  }
}
