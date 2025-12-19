import { Comment } from "../types/comment";
import { CreateCommentInputModel } from "../dto/createCommentInputModel";
import { CommentRepository } from "../repositories/comment.repositories";
import { PagingAndSortType } from "../../../core/types/pagingAndSortType";
import { CommentResponse } from "../types/commentResponse";
import { UpdateCommentInputModel } from "../dto/updateCommentInputModel";

export class CommentService {
  constructor(private commentRepository: CommentRepository) {}

  async findCommentsByPostId(
    query: PagingAndSortType,
    postId: string
  ): Promise<CommentResponse | null> {
    return this.commentRepository.findCommentsByPostId(query, postId);
  }

  async findCommentById(id: string): Promise<Comment | null> {
    return this.commentRepository.findCommentById(id);
  }

  async createComment(body: CreateCommentInputModel): Promise<Comment | null> {
    const { content, postId, userId } = body;

    const dto = {
      postId,
      content,
      userId,
      createdAt: new Date().toISOString()
    };

    return this.commentRepository.createComment(dto);
  }

  async updateComment(
    id: string,
    userId: string,
    body: UpdateCommentInputModel
  ): Promise<boolean | null> {
    const { content } = body;

    const dto = {
      content
    };

    return this.commentRepository.updateComment(id, userId, dto);
  }

  async deleteCommentById(id: string, userId: string): Promise<boolean | null> {
    return this.commentRepository.deleteCommentById(id, userId);
  }
}
