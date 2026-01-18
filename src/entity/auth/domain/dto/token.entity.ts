import { HydratedDocument, model, Model, Schema } from "mongoose";

interface Token {
  token: string;
}

const tokenSchema = new Schema<Token>({
  token: { type: String, required: true }
});

export const TokenModel = model<Token, Model<Token>>(
  "token",
  tokenSchema,
  "token"
);
export type TokenDocument = HydratedDocument<Token>;
