import { securityCollection } from "../../../db/mongo.db";

export const securityRepository = {
  async createSession(dto: any): Promise<any | null> {
    const { userId, title, ip, lastActiveDate, deviceId } = dto;

    const data = {
      id: userId,
      ip,
      title,
      lastActiveDate,
      deviceId
    };

    const insertResult = await securityCollection.insertOne({ ...data });
    return insertResult;
  }
};
