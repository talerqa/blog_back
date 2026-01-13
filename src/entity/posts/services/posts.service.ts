import { Post } from "../types/post";
import { CreateBlogInputModel } from "../dto/createPostsInputModel";
import { UpdatePostInputModel } from "../dto/updatePostsInputModel";
import { PagingAndSortType } from "../../../core/types/pagingAndSortType";
import { PostResponse } from "../../blogs/types/postResponse";
import { PostsRepository } from "../repositories/posts.repositories";

export class PostsService {
  constructor(private postsRepository: PostsRepository) {}

  async findAllPosts(
    query: PagingAndSortType,
    userId: string
  ): Promise<PostResponse> {
    return this.postsRepository.findAllPosts(query, userId);
  }

  async findPostById(id: string, userId: string): Promise<Post | null> {
    return this.postsRepository.findPostById(id, userId);
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

  async updateLikeComments(
    id: string,
    userId: string,
    likeStatus: string
  ): Promise<boolean | null> {
    return this.postsRepository.updateLikeComment(id, userId, likeStatus);
  }
}
