import { Blog } from "../types/blog";
import { CreateBlogInputModel } from "../dto/createBlogsInputModel";
import { UpdateBlogInputModel } from "../dto/updateBlogsInputModel";
import { Post } from "../../posts/types/post";
import { PostsRepository } from "../../posts/repositories/posts.repositories";
import { BlogsRepository } from "../repositories/mutationBlogs.repositories";

export class BlogsService {
  constructor(
    private blogsRepository: BlogsRepository,
    private postsRepository: PostsRepository
  ) {}

  async createBlog(dto: CreateBlogInputModel): Promise<Blog | null> {
    const body: CreateBlogInputModel = {
      description: dto.description,
      name: dto.name,
      websiteUrl: dto.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false
    };

    return this.blogsRepository.createBlog(body);
  }

  async updateBlog(id: string, body: UpdateBlogInputModel): Promise<boolean> {
    const { description, name, websiteUrl }: UpdateBlogInputModel = body;

    const dto: UpdateBlogInputModel = {
      description,
      name,
      websiteUrl
    };

    return this.blogsRepository.updateBlog(id, dto);
  }

  async deleteBlogById(id: string): Promise<boolean> {
    return this.blogsRepository.deleteBlogById(id);
  }

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

    return this.postsRepository.createPostBlogId(id, dto);
  }
}
