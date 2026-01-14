import { Blog } from "../types/blog";
import { UpdateBlogInputModel } from "../dto/updateBlogsInputModel";
import { CreateBlogInputModel } from "../dto/createBlogsInputModel";
import { MutationBlogRepo } from "./utils/mutationRepo";
import { BlogDocument, BlogModel } from "../domain/dto/blog.entity";

export class BlogsRepository {
  constructor(private mutationBlogRepo: MutationBlogRepo) {}

  async createBlog(dto: CreateBlogInputModel): Promise<Blog | null> {
    const { name, description, createdAt, isMembership, websiteUrl } = dto;
    const blog: BlogDocument = await new BlogModel({ ...dto } as Blog);
    await blog.save();
    const id = blog._id as string;

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
    const blog = await BlogModel.findByIdAndUpdate(
      id,
      {
        $set: {
          name: dto.name,
          description: dto.description,
          websiteUrl: dto.websiteUrl
        }
      },
      { new: true }
    );

    return blog !== null;
  }

  async deleteBlogById(id: string): Promise<boolean> {
    const deletedBlog = await BlogModel.findByIdAndDelete(id);
    return deletedBlog !== null;
  }
}
