import { Security } from "../../../entity/security/types/security";
import { SecurityResponse } from "../../../entity/security/types/securityResponse";

export const mapToSecurityPaging = (
  sessions: Security[]
): SecurityResponse[] => {
  return sessions.map(session => {
    return {
      ip: session.ip,
      title: session.title,
      lastActiveDate: session.lastActiveDate,
      deviceId: session.deviceId
    };
  });
};
