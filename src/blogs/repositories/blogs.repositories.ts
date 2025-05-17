import {Blog} from "../types/blog";
import {UpdateBlogInputModel} from "../dto/updateBlogsInputModel";
import {ObjectId, WithId, WithoutId} from "mongodb";
import {blogCollection} from "../../db/mongo.db";

export const blogsRepository = {
  async findAllBlogs(): Promise<WithId<Blog>[]> {
    return blogCollection.find().toArray();
  },

  async findBlogById(id: string): Promise<WithId<Blog>> | null {
    return await blogCollection.findOne({_id: new ObjectId(id)}) ?? null;
  },

  async createBlog(dto: WithoutId<Blog>): Promise<WithId<Blog>> {
    const insertResult = await blogCollection.insertOne(dto);
    return {...dto, _id: insertResult.insertedId}
  },

  async updateBlog(id: string, dto: UpdateBlogInputModel): Promise<WithId<Blog>> {
    const blog = await blogCollection.findOne({_id: new ObjectId(id)})

    if (!blog) {
      throw new Error('')
      return
    }

    blog.name = dto.name;
    blog.description = dto.description;
    blog.websiteUrl = dto.websiteUrl;
    blog.isMembership = dto.isMembership;
    return blog;
  },

  async deleteBlogById(id: string): number {
    return blogCollection.deleteOne({_id: new ObjectId(id)});
  },
};