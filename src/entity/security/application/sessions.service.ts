import { securityRepository } from "../repositories/security.repositories";

export const sessionsService = {
  async getCurrentSessionDevice(userId: string) {
    return securityRepository.getCurrentSessionDevice(userId);
  },

  async removeOtherSessionDevice(userId: string, deviceId: string) {
    return securityRepository.removeOtherSessionDevice(userId, deviceId);
  },

  async removeCurrentSessionDevice(userId: string, deviceId: string) {
    return securityRepository.removeCurrentSessionDevice(userId, deviceId);
  }
};
