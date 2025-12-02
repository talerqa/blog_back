import { UsersRepositories } from "./repositories/usersRepositories";
import { MutationUsersRepositories } from "./repositories/mutationUsers.repositories";
import { UserService } from "./application/user.service";
import { NodemailerService } from "../auth/service/emailService";
import { securityRepository } from "../security/compositionRoot";
import { passwordService } from "../../core/utils/passUtils";

export const nodemailerService = new NodemailerService();
export const usersRepositories = new UsersRepositories();
export const mutationUsersRepositories = new MutationUsersRepositories(
  passwordService
);
export const userService = new UserService(
  usersRepositories,
  mutationUsersRepositories,
  securityRepository,
  passwordService
);
