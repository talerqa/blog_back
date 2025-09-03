import { mutationUsersRepositories } from "../repositories/mutationUsers.repositories";
import { CreateUserInputModel } from "../dto/createUserInputModel";
import { User } from "../types/user";
import { userCollection } from "../../../db/mongo.db";
import { comparePassword } from "../../../core/utils/comparePassword";
import jwt, { PrivateKey, Secret } from "jsonwebtoken";
import { usersRepositories } from "../repositories/users.repositories";

export const userService = {
  async login(loginOrEmail: string, password: string): Promise<string> {
    const user = await userCollection.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }]
    });

    if (!user) {
      throw new Error("not found user");
    }

    const isMatch = comparePassword(password, user.password as string);

    if (!isMatch) {
      throw new Error("login/email or password not match");
    }

    return jwt.sign(
      {
        userId: user._id.toString()
      },
      process.env.SECRET_KEY as Secret | PrivateKey,
      { expiresIn: "1h" }
    );
  },

  async createUser(
    dto: CreateUserInputModel
  ): Promise<Omit<User, "password" | "emailConfirmation"> | null> {
    const { email, password, login } = dto;

    const body: CreateUserInputModel = {
      email,
      login,
      password
    };
    await usersRepositories.isExistUserWithLoginOrEmail(login, email);

    return mutationUsersRepositories.createUser(body);
  },

  async deleteUserById(id: string): Promise<boolean> {
    return mutationUsersRepositories.deleteUserById(id);
  }
};
