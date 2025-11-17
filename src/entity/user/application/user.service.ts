import { mutationUsersRepositories } from "../repositories/mutationUsers.repositories";
import { CreateUserInputModel } from "../dto/createUserInputModel";
import { User } from "../types/user";
import { securityCollection, userCollection } from "../../../db/mongo.db";
import { comparePassword } from "../../../core/utils/comparePassword";
import { usersRepositories } from "../repositories/users.repositories";
import { jwtService } from "../../../core/utils/jwtUtils";
import { config } from "../../../core/const/config";
import { securityRepository } from "../../security/repositories/security.repositories";
import { CreateSessionModel } from "../../security/dto/createSessionModel";

export const userService = {
  async login(
    loginOrEmail: string,
    password: string,
    body: { title: string; ip: string }
  ): Promise<{
    refreshToken: string;
    accessToken: string;
  }> {
    const { title, ip } = body;
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

    const accessToken = jwtService.sing(
      userId,
      config.expiredAccessToken,
      body
    );
    const refreshToken = jwtService.sing(
      userId,
      config.expiredRefreshToken,
      body
    );

    const payloadB64 = accessToken.split(".")[1];
    const json = Buffer.from(payloadB64, "base64url").toString();
    const data = JSON.parse(json);
    const { deviceId, exp } = data;

    const date = new Date(exp * 1000); // timestamp в секундах → переводим в миллисекунды
    const lastActiveDate = date.toISOString();
    const dto: CreateSessionModel = {
      userId,
      title,
      ip,
      lastActiveDate,
      deviceId
    };
    await securityRepository.createSession(dto);

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

  async refreshToken(userId: string, body: any) {
    const { expDate, deviceId, title, ip } = body;

    const session = await securityCollection.findOne({
      deviceId: deviceId,
      id: userId
    });

    if (!session) {
      throw new Error("not_found_session");
    }

    if (expDate) {
      const expIso = new Date(expDate * 1000).toISOString();
      await securityCollection.updateOne(
        { deviceId: deviceId },
        {
          $set: {
            lastActiveDate: expIso
          }
        }
      );
    }

    const accessToken = jwtService.sing(
      userId,
      config.expiredAccessToken,
      body
    );
    const refreshToken = jwtService.sing(
      userId,
      config.expiredAccessToken,
      body
    );

    return {
      refreshToken,
      accessToken
    };
  }
};
