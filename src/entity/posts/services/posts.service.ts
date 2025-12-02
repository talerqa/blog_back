import { Post } from "../types/post";
import { CreateBlogInputModel } from "../dto/createPostsInputModel";
import { UpdatePostInputModel } from "../dto/updatePostsInputModel";
import { PagingAndSortType } from "../../../core/types/pagingAndSortType";
import { PostResponse } from "../../blogs/types/postResponse";
import { PostsRepository } from "../repositories/posts.repositories";

export class PostsService {
  constructor(private postsRepository: PostsRepository) {}

  async findAllPosts(query: PagingAndSortType): Promise<PostResponse> {
    return this.postsRepository.findAllPosts(query);
  }

  async findPostById(id: string): Promise<Post | null> {
    return this.postsRepository.findPostById(id);
  }

  async createPost(body: CreateBlogInputModel): Promise<Post | null> {
    const { title, shortDescription, content, blogId } = body;

    const dto = {
      title,
      shortDescription,
      content,
      blogId,
      createdAt: new Date().toISOString()
    };

    return this.postsRepository.createPost(dto);
  }

  async updatePost(id: string, body: UpdatePostInputModel): Promise<boolean> {
    const { title, shortDescription, content, blogId } = body;

    const dto = {
      title,
      shortDescription,
      content,
      blogId
    };

    return this.postsRepository.updatePost(id, dto);
  }

  async deletePostById(id: string): Promise<boolean> {
    return this.postsRepository.deletePostById(id);
  }
}
