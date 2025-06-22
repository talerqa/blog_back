import { IMetaDataBlog } from "../../../entity/blogs/types/IMetaDataBlog";
import { WithId } from "mongodb";
import { Post } from "../../../entity/posts/types/post";
import { PostResponse } from "../../../entity/blogs/types/postResponse";

export const mapToPostPaging = (
  post: WithId<Post>[],
  metaData: IMetaDataBlog
): PostResponse => {
  const items = post.map((post: WithId<Post>) => {
    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt
    };
  });

  return {
    items,
    ...metaData
  };
};
