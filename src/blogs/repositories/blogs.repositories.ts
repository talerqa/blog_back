import {Blog} from "../types/blog";
import {UpdateBlogInputModel} from "../dto/updateBlogsInputModel";
import {ObjectId, WithId, WithoutId} from "mongodb";
import {blogCollection} from "../../db/mongo.db";

export const blogsRepository = {
  async findAllBlogs(): Promise<any> {
    return blogCollection.find().toArray();
  },

  async findBlogById(id: string): Promise<any>{
    return await blogCollection.findOne({_id: new ObjectId(id)}) ?? null;
  },

  async createBlog(dto: WithoutId<Blog>): Promise<any> {
    const insertResult = await blogCollection.insertOne(dto);
    return {...dto, _id: insertResult.insertedId}
  },

  async updateBlog(id: string, dto: UpdateBlogInputModel):Promise<any>{
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

  async deleteBlogById(id: string): Promise<any> {
    return blogCollection.deleteOne({_id: new ObjectId(id)});
  },
};