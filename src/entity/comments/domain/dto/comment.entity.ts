import { HydratedDocument, model, Model, Schema } from "mongoose";
import { myStatusLikesInfo } from "../../types/comment";

export type myStatusLikesInfo = "None" | "Like" | "Dislike";

export type CommentatorInfo = {
  userId: string;
  userLogin: string;
};

export interface Comment {
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: string;
  likesInfo: {
    likesCount: string[];
    dislikesCount: string[];
    myStatus: myStatusLikesInfo;
  };
}

const commentatorInfoSchema = new Schema<CommentatorInfo>(
  {
    userId: { type: String, required: true },
    userLogin: { type: String, required: true }
  },
  { _id: false }
);

const likesInfoSchema = new Schema<CommentatorInfo>(
  {
    likesCount: { type: [String] },
    dislikesCount: { type: [String] },
    myStatus: {
      type: String,
      enum: ["None", "Like", "Dislike"],
      default: "None"
    }
  },
  { _id: false }
);

const commentSchema = new Schema<Comment>({
  content: { type: String, required: true },
  commentatorInfo: { type: commentatorInfoSchema, required: true },
  createdAt: { type: Date, required: true },
  likesInfo: { type: likesInfoSchema, required: true }
});

export const CommentModel = model<Comment, Model<Comment>>(
  "comment",
  commentSchema,
  "comment"
);
export type CommentDocument = HydratedDocument<Comment>;
