import { HydratedDocument, model, Model, Schema } from "mongoose";

interface User {
  name: string;
  description: string;
  websiteUrl: string;
  isMembership: boolean;
  createdAt: Date;
}

const emailConfirmationSchema = new Schema(
  {
    confirmationCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    isConfirmed: { type: Boolean, required: true }
  },
  { _id: false }
);

const recoveryCodeSchema = new Schema(
  {
    recoveryCode: { type: String, required: true }
  },
  { _id: false }
);

const userSchema = new Schema<User>({
  login: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, required: true },
  emailConfirmation: { type: emailConfirmationSchema, required: true },
  passwordRecovery: { type: recoveryCodeSchema }
});

export const UserModel = model<User, Model<User>>("user", userSchema, "user");
export type UserDocument = HydratedDocument<User>;
