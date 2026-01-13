import { Request, Response } from "express";
import { PagingAndSortType } from "../../../../core/types/pagingAndSortType";
import { HttpStatus } from "../../../../core/const/httpCodes";
import { postsService } from "../../compositionRoot";

export const getAllPostsHandler = async (req: Request, res: Response) => {
  const query = req.query;
  const userId = req.headers?.userId as string;

  const blogs = await postsService.findAllPosts(
    (query as unknown) as PagingAndSortType,
    userId
  );
  res.status(HttpStatus.Ok).send(blogs);
};
