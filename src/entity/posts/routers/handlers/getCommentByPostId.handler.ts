import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/const/httpCodes";
import { PagingAndSortType } from "../../../../core/types/pagingAndSortType";
import { commentService } from "../../../comments/compositionRoot";

export const getCommentByPostIdHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const postId = req.params?.postId as string;
    const userId = req.headers?.userId as string;

    const query = req.query;
    const post = await commentService.findCommentsByPostId(
      (query as unknown) as PagingAndSortType,
      postId,
      userId
    );

    res.status(HttpStatus.Ok).send(post);
  } catch (e) {
    res.status(HttpStatus.NotFound).send();
  }
};
