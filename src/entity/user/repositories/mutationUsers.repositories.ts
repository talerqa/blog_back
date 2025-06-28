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
      return {
        errorsMessages: [{ field: "login", message: "login should be unique" }]
      };
    }

    if (wrongEmail) {
      return {
        errorsMessages: [{ field: "email", message: "email should be unique" }]
      };
    }

    const insertResult = await userCollection.insertOne({ ...dto } as User);
    const id = insertResult.insertedId;

    const user = await userCollection.findOne({ _id: id });

    if (!user) {
      return null;
    }
    const createdAt = new Date().toISOString();

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
