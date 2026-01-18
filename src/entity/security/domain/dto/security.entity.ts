import { HydratedDocument, model, Model, Schema } from "mongoose";

interface Security {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;
}

const securitySchema = new Schema<Security>({
  ip: { type: String, required: true },
  title: { type: String, required: true },
  lastActiveDate: { type: Date, default: false },
  deviceId: { type: String, required: true }
});

export const SecurityModel = model<Security, Model<Security>>(
  "security",
  securitySchema,
  "security"
);
export type SecurityDocument = HydratedDocument<Security>;
