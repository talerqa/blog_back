import { Blog } from "../types/blog";
import { CreateBlogInputModel } from "../dto/createBlogsInputModel";
import { UpdateBlogInputModel } from "../dto/updateBlogsInputModel";
import { Post } from "../../posts/types/post";
import { postsRepository } from "../../posts/repositories/posts.repositories";
import { blogsRepository } from "../repositories/mutationBlogs.repositories";

export const blogsService = {
  async createBlog(dto: CreateBlogInputModel): Promise<Blog | null> {
    const body: CreateBlogInputModel = {
      description: dto.description,
      name: dto.name,
      websiteUrl: dto.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false
    };

    return blogsRepository.createBlog(body);
  },

  async updateBlog(id: string, body: UpdateBlogInputModel): Promise<boolean> {
    const { description, name, websiteUrl }: UpdateBlogInputModel = body;

    const dto: UpdateBlogInputModel = {
      description,
      name,
      websiteUrl
    };

    return blogsRepository.updateBlog(id, dto);
  },

  async deleteBlogById(id: string): Promise<boolean> {
    return blogsRepository.deleteBlogById(id);
  },

  async createPostByBlogId(
    id: string,
    body: CreateBlogInputModel
  ): Promise<Post | null> {
    const { title, shortDescription, content }: CreateBlogInputModel = body;

    const dto = {
      title: title as string,
      shortDescription: shortDescription as string,
      content: content as string,
      blogId: id,
      createdAt: new Date().toISOString()
    };

    return postsRepository.createPostBlogId(id, dto);
  }
};
