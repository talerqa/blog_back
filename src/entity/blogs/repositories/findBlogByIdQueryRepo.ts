import { Blog } from "../types/blog";
import { queryBlogRepo } from "./utils/queryRepo";
import { BlogModel } from "../domain/dto/blog.entity";

export const findBlogById = async (id: string): Promise<Blog | null> => {
  const blog = await BlogModel.findById(id).exec();

  if (!blog) {
    return null;
  }

  return queryBlogRepo.getBlogById(blog as Blog);
};
