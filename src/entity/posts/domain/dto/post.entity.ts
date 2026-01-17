import { HydratedDocument, model, Model, Schema } from "mongoose";
import { myStatusLikesInfo, NewestLikesType } from "../../types/post";

interface NewestLikesType {
  userId: string;
  addedAt: string;
  login: string;
}

interface LikeDislikeItem {
  userId: string;
  addedAt: string;
  login: string;
}

interface ExtendedLikesInfo {
  likesCount: LikeDislikeItem[]; // меняем string[] на массив объектов
  dislikesCount: LikeDislikeItem[]; // меняем string[] на массив объектов
  myStatus: myStatusLikesInfo;
  newestLikes: NewestLikesType[];
}

export interface Post {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: ExtendedLikesInfo;
}

const likeDislikeSchema = new Schema(
  {
    userId: { type: String, required: true },
    addedAt: { type: Date, required: true },
    login: { type: String, required: true }
  },
  { _id: false }
);

const extendedLikesInfoSchema = new Schema<ExtendedLikesInfo>(
  {
    likesCount: { type: [likeDislikeSchema], default: [] },
    dislikesCount: { type: [likeDislikeSchema], default: [] },
    myStatus: {
      type: String,
      enum: ["None", "Like", "Dislike"],
      default: "None"
    },
    newestLikes: { type: [likeDislikeSchema], default: [] }
  },
  { _id: false }
);

const postSchema = new Schema<Post>({
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  content: { type: String, required: true },
  blogId: { type: String, required: true },
  blogName: { type: String, required: true },
  createdAt: { type: Date, required: true },
  extendedLikesInfo: { type: extendedLikesInfoSchema }
});

export const PostModel = model<Post, Model<Post>>("post", postSchema, "post");
export type PostDocument = HydratedDocument<Post>;
