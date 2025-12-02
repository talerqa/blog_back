import {
  mutationUsersRepositories,
  nodemailerService,
  userService,
  usersRepositories
} from "../user/compositionRoot";
import { AuthService } from "./service/authService";
import { passwordService } from "../../core/utils/passUtils";

export const authService = new AuthService(
  usersRepositories,
  mutationUsersRepositories,
  userService,
  nodemailerService,
  passwordService
);
