import { CreateUserInputModel } from "../dto/createUserInputModel";
import { User } from "../types/user";
import { jwtService } from "../../../core/utils/jwtUtils";
import { config } from "../../../core/const/config";
import { CreateSessionModel } from "../../security/dto/createSessionModel";
import { MutationUsersRepositories } from "../repositories/mutationUsers.repositories";
import { UsersRepositories } from "../repositories/usersRepositories";
import { securityCollection, userCollection } from "../../../db/mongo.db";
import { SecurityRepository } from "../../security/repositories/security.repositories";
import { PasswordService } from "../../../core/utils/passUtils";

export class UserService {
  constructor(
    private usersRepositories: UsersRepositories,
    private mutationUsersRepositories: MutationUsersRepositories,
    private securityRepository: SecurityRepository,
    private passwordService: PasswordService
  ) {}

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

    const isMatch = await this.passwordService.comparePassword(
      password,
      user.password as string
    );

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
    await this.securityRepository.createSession(dto);

    return {
      refreshToken,
      accessToken
    };
  }

  async createUser(
    dto: CreateUserInputModel
  ): Promise<Omit<User, "password" | "emailConfirmation"> | null> {
    const { email, password, login } = dto;

    await this.usersRepositories.isExistUserWithLoginOrEmail(login, email);
    return this.mutationUsersRepositories.createUser(dto);
  }

  async deleteUserById(id: string): Promise<boolean> {
    return this.mutationUsersRepositories.deleteUserById(id);
  }

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
}
