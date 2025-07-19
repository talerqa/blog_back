import { userCollection } from "../../../db/mongo.db";
import { User } from "../types/user";
import { ObjectId } from "mongodb";

export const findUserQueryRepo = async (
  userId: string
): Promise<User | null> => {
  const user = await userCollection.findOne({ _id: new ObjectId(userId) });

  console.log(user);
  if (!user) {
    return null;
  }

  return user;
};
