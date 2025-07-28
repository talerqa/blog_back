import { ObjectId } from "mongodb";
import { userCollection } from "../../../db/mongo.db";
import { CreateUserInputModel } from "../dto/createUserInputModel";
import { User } from "../types/user";
import { generatePassword } from "../../../core/utils/generatePassword";

export const mutationUsersRepositories = {
  async existUserOrEmail(login: string, email: string): Promise<boolean> {
    const wrongLogin = await userCollection.findOne({
      login
    });
    const wrongEmail = await userCollection.findOne({
      email
    });

    if (wrongLogin) {
      throw new Error("wrongLogin");
    }

    if (wrongEmail) {
      throw new Error("wrongEmail");
    }

    return true;
  },

  async createUser(dto: CreateUserInputModel): Promise<User | null> {
    const { login, email, password } = dto;

    const isExist = await mutationUsersRepositories.existUserOrEmail(
      login,
      email
    );

    if (!isExist) return null;

    const createdAt = new Date().toISOString();
    const passwordHash = await generatePassword(password);
    const insertResult = await userCollection.insertOne({
      ...dto,
      password: passwordHash,
      createdAt
    } as User);
    const id = insertResult.insertedId;

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
  },

  async createUserWithEmailConfirm(dto: any): Promise<User | null> {
    const insertResult = await userCollection.insertOne({
      ...dto
    } as User);
    const id = insertResult.insertedId;

    const user = await userCollection.findOne({ _id: id });

    if (!user) {
      return null;
    }

    return user;
  },

  async deleteUserById(id: string): Promise<boolean> {
    const { deletedCount } = await userCollection.deleteOne({
      _id: new ObjectId(id)
    });
    return !!deletedCount;
  }
};
