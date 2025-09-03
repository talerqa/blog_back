import { userCollection } from "../../../db/mongo.db";
import { User } from "../types/user";
import { ObjectId } from "mongodb";

export const findUserByIdQueryRepo = async (
  userId: string
): Promise<User | null> => {
  const user = await userCollection.findOne({ _id: new ObjectId(userId) });

  if (!user) {
    throw new Error("user not found");
  }

  return user;
};
