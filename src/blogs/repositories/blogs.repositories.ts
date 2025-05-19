import { Blog } from "../types/blog";
import { UpdateBlogInputModel } from "../dto/updateBlogsInputModel";
import { ObjectId } from "mongodb";
import { blogCollection } from "../../db/mongo.db";
import { CreateBlogInputModel } from "../dto/createBlogsInputModel";

export const blogsRepository = {
  async findAllBlogs(): Promise<Blog[]> {
    const blogs = await blogCollection.find().toArray();

    return blogs.map(blog => {
      return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership ?? false
      };
    });
  },

  async findBlogById(id: string): Promise<Blog> | null {
    const blog = await blogCollection.findOne({ _id: new ObjectId(id) });

    if (!blog) {
      return null;
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

  async createBlog(dto: CreateBlogInputModel): Promise<Blog> {
    const insertResult = await blogCollection.insertOne({
      _id: undefined,
      id: "",
      ...dto,
      isMembership: dto?.isMembership ?? false
    });

    return {
      id: insertResult.insertedId.toString(),
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      createdAt: dto.createdAt,
      isMembership: dto.isMembership
    };
  },

  async updateBlog(id: string, dto: UpdateBlogInputModel): Promise<boolean> {
    const blog = await blogCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: dto.name,
          description: dto.description,
          websiteUrl: dto.websiteUrl
        }
      }
    );

    return !(blog.matchedCount < 1);
  },

  async deleteBlogById(id: string): Promise<boolean> {
    const { deletedCount } = await blogCollection.deleteOne({
      _id: new ObjectId(id)
    });
    return !!deletedCount;
  }
};
