import { Request, Response } from "express";
import { postsService } from "../../application/posts.service";
import { HttpStatus } from "../../../../core/types/httpCodes";
import { PagingAndSortType } from "../../../../core/types/pagingAndSortType";
import { commentService } from "../../../comments/service/comment.service";

export const getCommentByPostIdHandler = async (
  req: Request,
  res: Response
) => {
  const postId = req.params?.postId as string;

  const query = req.query;
  const post = await commentService.findCommentsByPostId(
    (query as unknown) as PagingAndSortType,
    postId
  );

  if (!post) {
    res.status(HttpStatus.NotFound).send();
  }
  res.status(HttpStatus.Ok).send(post);
};
