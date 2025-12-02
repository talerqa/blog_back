import { SecurityRepository } from "./repositories/security.repositories";
import { SessionsService } from "./application/sessions.service";

export const securityRepository = new SecurityRepository();
export const sessionsService = new SessionsService(securityRepository);
