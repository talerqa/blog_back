import { securityCollection } from "../../../db/mongo.db";
import { errorsName } from "../../../core/const/errorsName";
import { WithId } from "mongodb";
import { Security } from "../types/security"; //CДЕЛАТЬ РЕПОЗИТОРИЙЙЙ!!!!!!!!!!!!!!

//CДЕЛАТЬ РЕПОЗИТОРИЙЙЙ!!!!!!!!!!!!!!
export const sessionsService = {
  async getCurrentSessionDevice(userId: string) {
    const sessions = await securityCollection
      .find({
        id: userId
      })
      .toArray();

    return sessions.map((session: WithId<Security>) => {
      return {
        ip: session.ip,
        title: session.title,
        lastActiveDate: session.lastActiveDate,
        deviceId: session.deviceId
      };
    });
  },

  async removeOtherSessionDevice(body: {
    userId: string;
    expDate: string;
    deviceId: string;
    title: string;
    ip: string;
  }) {
    const { userId, ip, title, deviceId, expDate } = body;

    const { deletedCount } = await securityCollection.deleteMany({
      id: userId,
      deviceId: { $ne: deviceId }
    });
    return !!deletedCount;
  },

  async removeCurrentSessionDevice(body: {
    userId: string;
    expDate: string;
    deviceId: string;
    title: string;
    ip: string;
  }) {
    const { userId, ip, title, deviceId, expDate } = body;

    const isFound = await securityCollection.findOne({
      deviceId: deviceId
    });

    if (!isFound) {
      throw Error(errorsName.not_found_deviceId);
    }

    const { deletedCount } = await securityCollection.deleteOne({
      deviceId: deviceId,
      id: userId
    });

    return !!deletedCount;
  }
};
