import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/const/httpCodes";
import { PagingAndSortType } from "../../../../core/types/pagingAndSortType";
import { findPostsByBlogId } from "../../repositories/findPostsByBlogIdQueryRepo";

export const getAllPostsByBlogIdHandler = async (
  req: Request,
  res: Response
) => {
  const id = req.params?.blogId as string;
  const query = req.query;
  const posts = await findPostsByBlogId(
    id,
    (query as unknown) as PagingAndSortType
  );

  if (!posts) {
    res.status(HttpStatus.NotFound).send();
  }
  res.status(HttpStatus.Ok).send(posts);
};
