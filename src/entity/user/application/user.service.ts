import { mutationUsersRepositories } from "../repositories/mutationUsers.repositories";
import { CreateUserInputModel } from "../dto/createUserInputModel";
import { User } from "../types/user";
import { generatePassword } from "../../../core/utils/generatePassword";

export const userService = {
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
