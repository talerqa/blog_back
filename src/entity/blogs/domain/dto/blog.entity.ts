import { HydratedDocument, model, Model, Schema } from "mongoose";

interface Blog {
  name: string;
  description: string;
  websiteUrl: string;
  isMembership: boolean;
  createdAt: Date;
}

const blogSchema = new Schema<Blog>({
  createdAt: { type: Date, required: true },
  description: { type: String, required: true },
  isMembership: { type: Boolean, default: false },
  name: { type: String, required: true },
  websiteUrl: { type: String, required: true }
});

export const BlogModel = model<Blog, Model<Blog>>("blog", blogSchema, "blog");
export type BlogDocument = HydratedDocument<Blog>;
