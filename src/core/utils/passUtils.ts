import bcrypt from "bcrypt";

export class PasswordService {
  async generatePassword(password: string) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(password, salt);
  }

  async comparePassword(password: string, userPassword: string) {
    return bcrypt.compare(password, userPassword);
  }
}

export const passwordService = new PasswordService();
