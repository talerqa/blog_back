import { Comment } from "../types/comment";
import { CreateCommentInputModel } from "../dto/createCommentInputModel";
import { commentRepository } from "../repositories/comment.repositories";
import { PagingAndSortType } from "../../../core/types/pagingAndSortType";
import { CommentResponse } from "../types/commentResponse";
import { UpdateCommentInputModel } from "../dto/updateCommentInputModel";

export const commentService = {
  // async findAllPosts(query: PagingAndSortType): Promise<PostResponse> {
  //   return postsRepository.findAllPosts(query);
  // },
  //
  async findCommentsByPostId(
    query: PagingAndSortType,
    postId: string
  ): Promise<CommentResponse> | null {
    return commentRepository.findCommentsByPostId(query, postId);
  },

  async findCommentById(id: string): Promise<Comment | null> {
    return commentRepository.findCommentById(id);
  },

  async createComment(body: CreateCommentInputModel): Promise<Comment | null> {
    const { content, postId, userId } = body;

    const dto = {
      postId,
      content,
      userId,
      createdAt: new Date().toISOString()
    };

    return commentRepository.createComment(dto);
  },

  async updateComment(
    id: string,
    userId: string,
    body: UpdateCommentInputModel
  ): Promise<boolean> {
    const { content } = body;

    const dto = {
      content
    };

    return commentRepository.updateComment(id, userId, dto);
  },

  async deleteCommentById(id: string, userId: string): Promise<boolean> {
    return commentRepository.deleteCommentById(id, userId);
  }
};
