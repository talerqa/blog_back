import { mutationUsersRepositories } from "../repositories/mutationUsers.repositories";
import { CreateUserInputModel } from "../dto/createUserInputModel";
import { User } from "../types/user";
import { generatePassword } from "../../../core/utils/generatePassword";
import { userCollection } from "../../../db/mongo.db";
import { comparePassword } from "../../../core/utils/comparePassword";
import jwt from "jsonwebtoken";

export const userService = {
  async login(loginOrEmail: string, password: string): Promise<boolean | null> {
    const user = await userCollection.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }]
    });

    if (!user) {
      return null;
    }

    const isMatch = await comparePassword(password, user.password as string);

    if (!isMatch) {
      return null;
    }

    const token = jwt.sign(
      {
        userId: user?._id.toString()
      },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    return token;
  },

  async createUser(dto: CreateUserInputModel): Promise<User | null> {
    const { email, password, login } = dto;

    const pass = await generatePassword(password);

    const body: CreateUserInputModel = {
      email,
      login,
      password: pass
    };

    return mutationUsersRepositories.createUser(body);
  },

  async deleteUserById(id: string): Promise<boolean> {
    return mutationUsersRepositories.deleteUserById(id);
  }
};
