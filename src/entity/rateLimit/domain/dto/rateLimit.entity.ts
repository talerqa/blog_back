import { HydratedDocument, model, Model, Schema } from "mongoose";

interface RateLimit {
  ip: string;
  url: URL;
  date: string;
}

interface URL {
  baseUrl: string;
  originalUrl: string;
}

const urlSchema = new Schema<URL>({
  baseUrl: { type: String, required: true },
  originalUrl: { type: String, required: true }
});

const rateLimitSchema = new Schema<RateLimit>({
  ip: { type: String, required: true },
  date: { type: Date, required: true },
  url: { type: urlSchema, required: true }
});

export const RateLimitModel = model<RateLimit, Model<RateLimit>>(
  "rateLimit",
  rateLimitSchema,
  "rateLimit"
);
export type RateLimitDocument = HydratedDocument<RateLimit>;
