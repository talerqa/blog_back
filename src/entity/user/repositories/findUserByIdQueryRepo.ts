import { User } from "../types/user";
import { UserModel } from "../domain/dto/user.entity";

export const findUserByIdQueryRepo = async (
  userId: string
): Promise<User | null> => {
  const user = (await UserModel.findById(userId).exec()) as User;

  if (!user) {
    throw new Error("user not found");
  }

  return user;
};
