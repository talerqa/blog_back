import { securityCollection } from "../../../db/mongo.db";
import { mapToSecurityPaging } from "../../../core/utils/mappers/mapToSecurityPaging";
import { errorsName } from "../../../core/const/errorsName";
import { CreateSessionModel } from "../dto/createSessionModel";

export const securityRepository = {
  async getCurrentSessionDevice(userId: string) {
    const sessions = await securityCollection
      .find({
        id: userId
      })
      .toArray();

    return mapToSecurityPaging(sessions);
  },

  async removeOtherSessionDevice(userId: string, deviceId: string) {
    const { deletedCount } = await securityCollection.deleteMany({
      id: userId,
      deviceId: { $ne: deviceId }
    });
    return !!deletedCount;
  },

  async removeCurrentSessionDevice(userId: string, deviceId: string) {
    const isFound = await securityCollection.findOne({
      deviceId
    });

    if (!isFound) {
      throw Error(errorsName.not_found_deviceId);
    }

    const { deletedCount } = await securityCollection.deleteOne({
      deviceId,
      id: userId
    });

    return !!deletedCount;
  },

  async createSession(dto: CreateSessionModel): Promise<undefined> {
    const { userId, title, ip, lastActiveDate, deviceId } = dto;

    const data = {
      id: userId,
      ip,
      title,
      lastActiveDate,
      deviceId
    };
    await securityCollection.insertOne({ ...data });
    return;
  }
};
