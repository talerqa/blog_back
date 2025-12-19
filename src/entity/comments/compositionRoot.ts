import { CommentRepository } from "./repositories/comment.repositories";
import { CommentService } from "./service/comment.service";

export const commentRepository = new CommentRepository();
export const commentService = new CommentService(commentRepository);
