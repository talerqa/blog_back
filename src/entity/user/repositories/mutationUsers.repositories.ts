import { ObjectId } from "mongodb";
import { userCollection } from "../../../db/mongo.db";
import { CreateUserInputModel } from "../dto/createUserInputModel";
import { User } from "../types/user";

export const mutationUsersRepositories = {
  async createUser(dto: CreateUserInputModel): Promise<User | null> {
    const { login, email } = dto;

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

    const insertResult = await userCollection.insertOne({
      ...dto,
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

  async deleteUserById(id: string): Promise<boolean> {
    const { deletedCount } = await userCollection.deleteOne({
      _id: new ObjectId(id)
    });
    return !!deletedCount;
  }
};
