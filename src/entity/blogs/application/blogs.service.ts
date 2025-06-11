import { blogsRepository } from "../repositories/blogs.repositories";
import { Blog } from "../types/blog";
import { CreateBlogInputModel } from "../dto/createBlogsInputModel";
import { UpdateBlogInputModel } from "../dto/updateBlogsInputModel";
import { BlogResponse } from "../types/blogResponse";
import { PagingAndSortType } from "../../../core/types/pagingAndSortType";

export const blogsService = {
  async findAllBlogs(query: PagingAndSortType): Promise<BlogResponse> {
    return blogsRepository.findAllBlogs(query);
  },

  async findBlogById(id: string): Promise<Blog> | null {
    return blogsRepository.findBlogById(id);
  },

  async createBlog(dto: CreateBlogInputModel): Promise<Blog> {
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
    const { description, name, websiteUrl }: CreateBlogInputModel = body;

    const dto: UpdateBlogInputModel = {
      description,
      name,
      websiteUrl
    };

    return blogsRepository.updateBlog(id, dto);
  },

  async deleteBlogById(id: string): Promise<boolean> {
    return blogsRepository.deleteBlogById(id);
  }
};
