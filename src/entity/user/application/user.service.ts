import { mutationUsersRepositories } from "../repositories/mutationUsers.repositories";
import { CreateUserInputModel } from "../dto/createUserInputModel";
import { User } from "../types/user";
import { userCollection } from "../../../db/mongo.db";
import { comparePassword } from "../../../core/utils/comparePassword";
import { usersRepositories } from "../repositories/users.repositories";
import { jwtService } from "../../../core/utils/jwtUtils";
import { config } from "../../../core/const/config";

export const userService = {
  async login(
    loginOrEmail: string,
    password: string
  ): Promise<{
    refreshToken: string;
    accessToken: string;
  }> {
    const user = await userCollection.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }]
    });

    if (!user) {
      throw new Error("not found user");
    }

    const isMatch = await comparePassword(password, user.password as string);

    if (!isMatch) {
      throw new Error("login/email or password not match");
    }

    const userId = user._id.toString();

    const accessToken = jwtService.sing(userId, config.expiredAccessToken);
    const refreshToken = jwtService.sing(userId, config.expiredRefreshToken);

    return {
      refreshToken,
      accessToken
    };
  },

  async createUser(
    dto: CreateUserInputModel
  ): Promise<Omit<User, "password" | "emailConfirmation"> | null> {
    const { email, password, login } = dto;

    await usersRepositories.isExistUserWithLoginOrEmail(login, email);
    return mutationUsersRepositories.createUser(dto);
  },

  async deleteUserById(id: string): Promise<boolean> {
    return mutationUsersRepositories.deleteUserById(id);
  },

  async refreshToken(userId: string) {
    const accessToken = jwtService.sing(userId, config.expiredAccessToken);
    const refreshToken = jwtService.sing(userId, config.expiredRefreshToken);

    return {
      refreshToken,
      accessToken
    };
  }
};
