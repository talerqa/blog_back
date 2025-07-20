import { postsRepository } from "../repositories/posts.repositories";
import { Post } from "../types/post";
import { CreateBlogInputModel } from "../dto/createPostsInputModel";
import { UpdatePostInputModel } from "../dto/updatePostsInputModel";
import { PagingAndSortType } from "../../../core/types/pagingAndSortType";
import { PostResponse } from "../../blogs/types/postResponse";

export const postsService = {
  async findAllPosts(query: PagingAndSortType): Promise<PostResponse> {
    return postsRepository.findAllPosts(query);
  },

  async findPostById(id: string): Promise<Post | null> {
    return postsRepository.findPostById(id);
  },

  async createPost(body: CreateBlogInputModel): Promise<Post | null> {
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

  async updatePost(id: string, body: UpdatePostInputModel): Promise<boolean> {
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
