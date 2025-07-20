import { WithId } from "mongodb";
import { IMetaData } from "../../../entity/user/types/IMetaData";
import { Comment } from "../../../entity/comments/types/comment";
import { CommentResponse } from "../../../entity/comments/types/commentResponse";

export const mapToCommentsPaging = (
  post: WithId<Comment>[],
  metaData: IMetaData
): CommentResponse => {
  const items = post.map((post: WithId<Comment>) => {
    return {
      id: post._id.toString(),
      content: post.content,
      commentatorInfo: post.commentatorInfo,
      createdAt: post.createdAt
    };
  });

  return {
    items,
    ...metaData
  };
};
