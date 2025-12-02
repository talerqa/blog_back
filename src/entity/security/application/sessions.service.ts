import { SecurityRepository } from "../repositories/security.repositories";

export class SessionsService {
  constructor(private securityRepository: SecurityRepository) {}

  async getCurrentSessionDevice(userId: string) {
    return this.securityRepository.getCurrentSessionDevice(userId);
  }

  async removeOtherSessionDevice(userId: string, deviceId: string) {
    return this.securityRepository.removeOtherSessionDevice(userId, deviceId);
  }

  async removeCurrentSessionDevice(userId: string, deviceId: string) {
    return this.securityRepository.removeCurrentSessionDevice(userId, deviceId);
  }
}
