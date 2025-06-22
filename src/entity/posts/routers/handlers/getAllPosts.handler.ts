import { Request, Response } from "express";
import { postsService } from "../../application/posts.service";
import { PagingAndSortType } from "../../../../core/types/pagingAndSortType";
import { HttpStatus } from "../../../../core/types/httpCodes";

export const getAllPostsHandler = async (req: Request, res: Response) => {
  const query = req.query;
  const blogs = await postsService.findAllPosts(
    (query as unknown) as PagingAndSortType
  );
  res.status(HttpStatus.Ok).send(blogs);
};
