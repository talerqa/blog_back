import {Blog} from "../types/blog";
import {UpdateBlogInputModel} from "../dto/updateBlogsInputModel";
import {ObjectId, WithoutId} from "mongodb";
import {blogCollection} from "../../db/mongo.db";

export const blogsRepository = {
  async findAllBlogs(): Promise<any> {
    const blogs = await blogCollection.find().toArray()

    return blogs.map((blog) => ({
      id: blog?._id.toString(),
      name: blog?.name,
      description: blog?.description,
      websiteUrl: blog?.websiteUrl,
      createdAt: blog?.createdAt,
      isMembership: blog?.isMembership
    }));
  },

  async findBlogById(id: string): Promise<any> {
    const blog = await blogCollection.findOne({_id: new ObjectId(id)});

    if (!blog) {
      return null
    }

    return {
      id: blog?._id.toString(),
      name: blog?.name,
      description: blog?.description,
      websiteUrl: blog?.websiteUrl,
      createdAt: blog?.createdAt,
      isMembership: blog?.isMembership
    };
  },

  async createBlog(dto: WithoutId<Blog>): Promise<any> {
    const insertResult = await blogCollection.insertOne(dto);
    return {
      id: insertResult.insertedId.toString(),
      name: dto?.name,
      description: dto?.description,
      websiteUrl: dto?.websiteUrl,
      createdAt: dto?.createdAt,
      isMembership: dto?.isMembership
    };
  },

  async updateBlog(id: string, dto: UpdateBlogInputModel): Promise<any> {
    const blog = await blogCollection.updateOne({_id: new ObjectId(id)},
      {
        $set: {
          name: dto.name,
          description: dto.description,
          websiteUrl: dto.websiteUrl,
          isMembership: dto.isMembership
        }
      })

    return !(blog.matchedCount < 1)
  },

  async deleteBlogById(id: string): Promise<any> {
    const {deletedCount} = await blogCollection.deleteOne({_id: new ObjectId(id)});
    return !!deletedCount
  },
};