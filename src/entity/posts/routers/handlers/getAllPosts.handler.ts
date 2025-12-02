import { Request, Response } from "express";
import { PagingAndSortType } from "../../../../core/types/pagingAndSortType";
import { HttpStatus } from "../../../../core/const/httpCodes";
import { postsService } from "../../compositionRoot";

export const getAllPostsHandler = async (req: Request, res: Response) => {
  const query = req.query;
  const blogs = await postsService.findAllPosts(
    (query as unknown) as PagingAndSortType
  );
  res.status(HttpStatus.Ok).send(blogs);
};
