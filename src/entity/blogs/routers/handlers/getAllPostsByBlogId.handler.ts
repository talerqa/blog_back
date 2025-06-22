import { Request, Response } from "express";
import { blogsService } from "../../application/blogs.service";
import { HttpStatus } from "../../../../core/types/httpCodes";
import { PagingAndSortType } from "../../../../core/types/pagingAndSortType";

export const getAllPostsByBlogIdHandler = async (
  req: Request,
  res: Response
) => {
  const id = req.params?.blogId as string;
  const query = req.query;
  const posts = await blogsService.findAllPostByBlogId(
    id,
    (query as unknown) as PagingAndSortType
  );

  if (!posts) {
    res.status(HttpStatus.NotFound).send();
  }
  res.status(HttpStatus.Ok).send(posts);
};
