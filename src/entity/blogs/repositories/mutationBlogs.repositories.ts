import { Blog } from "../types/blog";
import { UpdateBlogInputModel } from "../dto/updateBlogsInputModel";
import { ObjectId } from "mongodb";
import { blogCollection } from "../../../db/mongo.db";
import { CreateBlogInputModel } from "../dto/createBlogsInputModel";
import { MutationBlogRepo } from "./utils/mutationRepo";

export class BlogsRepository {
  constructor(private mutationBlogRepo: MutationBlogRepo) {}

  async createBlog(dto: CreateBlogInputModel): Promise<Blog | null> {
    const { name, description, createdAt, isMembership, websiteUrl } = dto;
    const insertResult = await blogCollection.insertOne({ ...dto } as Blog);

    const id = insertResult.insertedId.toString();

    return this.mutationBlogRepo.createBlog({
      id,
      name,
      description,
      createdAt,
      isMembership,
      websiteUrl
    });
  }

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
  }

  async deleteBlogById(id: string): Promise<boolean> {
    const { deletedCount } = await blogCollection.deleteOne({
      _id: new ObjectId(id)
    });
    return !!deletedCount;
  }
}
