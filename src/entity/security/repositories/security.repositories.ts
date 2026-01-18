import { errorsName } from "../../../core/const/errorsName";
import { CreateSessionModel } from "../dto/createSessionModel";
import { mapperPaging } from "../../../core/utils/mapperPaging";
import { SecurityModel } from "../domain/dto/security.entity";
import { Security } from "../types/security";

export class SecurityRepository {
  async getCurrentSessionDevice(userId: string) {
    const sessions = (await SecurityModel.find({
      id: userId
    }).exec()) as Security[];

    return mapperPaging.mapToSecurityPaging(sessions);
  }

  async removeOtherSessionDevice(userId: string, deviceId: string) {
    const { deletedCount } = await SecurityModel.deleteMany({
      id: userId,
      deviceId: { $ne: deviceId }
    });

    return !!deletedCount;
  }

  async removeCurrentSessionDevice(userId: string, deviceId: string) {
    const isFound = await SecurityModel.findOne({
      deviceId
    });

    if (!isFound) {
      throw Error(errorsName.not_found_deviceId);
    }

    const { deletedCount } = await SecurityModel.deleteOne({
      deviceId,
      id: userId
    });

    return !!deletedCount;
  }

  async createSession(dto: CreateSessionModel): Promise<undefined> {
    const { userId, title, ip, lastActiveDate, deviceId } = dto;

    const data = {
      id: userId,
      ip,
      title,
      lastActiveDate,
      deviceId
    };
    const security = await new SecurityModel({ ...data });
    await security.save();
    return;
  }
}
