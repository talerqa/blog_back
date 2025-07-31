import { ObjectId } from "mongodb";
import { userCollection } from "../../../db/mongo.db";
import { CreateUserInputModel } from "../dto/createUserInputModel";
import { User } from "../types/user";
import { generatePassword } from "../../../core/utils/generatePassword";
import { randomUUID } from "node:crypto";

export const mutationUsersRepositories = {
  async existUserOrEmail(login: string, email: string): Promise<boolean | any> {
    const userByLogin = await userCollection.findOne({ login });
    if (userByLogin) {
      throw new Error("wrongLogin");
    }

    const userByEmail = await userCollection.findOne({ email });
    if (userByEmail) {
      throw new Error("wrongEmail");
    }
  },

  async createUser(dto: CreateUserInputModel): Promise<User | null> {
    const { login, email, password } = dto;

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

    const createdAt = new Date().toISOString();
    const passwordHash = await generatePassword(password);
    const insertResult = await userCollection.insertOne({
      ...dto,
      password: passwordHash,
      createdAt,
      emailConfirmation: {
        confirmationCode: randomUUID(),
        expirationDate: null,
        isConfirmed: null
      }
    } as User | any);
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
