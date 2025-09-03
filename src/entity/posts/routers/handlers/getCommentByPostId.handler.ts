import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/const/httpCodes";
import { PagingAndSortType } from "../../../../core/types/pagingAndSortType";
import { commentService } from "../../../comments/service/comment.service";

export const getCommentByPostIdHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const postId = req.params?.postId as string;

    const query = req.query;
    const post = await commentService.findCommentsByPostId(
      (query as unknown) as PagingAndSortType,
      postId
    );

    res.status(HttpStatus.Ok).send(post);
  } catch (e) {
    res.status(HttpStatus.NotFound).send();
  }
};
