import { Blog } from "../types/blog";
import { blogCollection } from "../../../db/mongo.db";
import { ObjectId } from "mongodb";
import { queryBlogRepo } from "./utils/queryRepo";

export const findBlogById = async (id: string): Promise<Blog | null> => {
  const blog = await blogCollection.findOne({ _id: new ObjectId(id) });

  if (!blog) {
    return null;
  }

  return queryBlogRepo.getBlogById(blog);
};
