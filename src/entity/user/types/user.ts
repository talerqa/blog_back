import { UUID } from "crypto";

type EmailConfirmation = {
  confirmationCode: UUID;
  expirationDate: string | Date;
  isConfirmed: boolean;
};

export type User = {
  id: string;
  login: string;
  email: string;
  password: string;
  createdAt: string | Date;
  emailConfirmation: EmailConfirmation;
};
