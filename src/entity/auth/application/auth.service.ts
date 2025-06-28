import { authRepository } from "../repositories/auth.repository";
import { generatePassword } from "../../../core/utils/generatePassword";

export const authService = {
  async login(loginOrEmail: string, password: string): Promise<boolean> {
    return authRepository.login(loginOrEmail, password);
  }
};
