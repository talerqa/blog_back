import { userCollection } from "../../../db/mongo.db";

const bcrypt = require("bcrypt");

export const authRepository = {
  async login(loginOrEmail: string, password: string): Promise<boolean | null> {
    const user = await userCollection.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }]
    });
    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return null;
    }

    return true;
  }
};
