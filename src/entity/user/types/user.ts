import { UUID } from "crypto";

type EmailConfirmation = {
  confirmationCode: UUID;
  expirationDate: string | Date;
  isConfirmed: boolean;
};
type PasswordRecovery = {
  recoveryCode: UUID | string;
};
export type User = {
  id: string;
  login: string;
  email: string;
  password: string;
  createdAt: string | Date;
  emailConfirmation: EmailConfirmation;
  passwordRecovery: PasswordRecovery;
};
