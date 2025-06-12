import { postsRepository } from "../repositories/posts.repositories";
import { Post } from "../types/post";
import { CreateBlogInputModel } from "../dto/createPostsInputModel";
import { UpdatePostInputModel } from "../dto/updatePostsInputModel";
import { PagingAndSortType } from "../../../core/types/pagingAndSortType";

export const postsService = {
  async findAllPosts(query: PagingAndSortType): Promise<Post[]> {
    return postsRepository.findAllPosts(query);
  },

  async findBlogById(id: string): Promise<Post | null> {
    return postsRepository.findBlogById(id);
  },

  async createPost(body: CreateBlogInputModel): Promise<Post> | null {
    const { title, shortDescription, content, blogId } = body;

    const dto = {
      title,
      shortDescription,
      content,
      blogId,
      createdAt: new Date().toISOString()
    };

    return postsRepository.createPost(dto);
  },

  async updatePost(
    id: string,
    body: UpdatePostInputModel
  ): Promise<Post> | null {
    const { title, shortDescription, content, blogId } = body;

    const dto = {
      title,
      shortDescription,
      content,
      blogId
    };

    return postsRepository.updatePost(id, dto);
  },

  async deletePostById(id: string): Promise<boolean> {
    return postsRepository.deletePostById(id);
  }
};
