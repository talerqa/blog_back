import { Request, Response } from "express";
import { blogsService } from "../../application/blogs.service";
import { PagingAndSortType } from "../../../../core/types/pagingAndSortType";
import { HttpStatus } from "../../../../core/types/httpCodes";

export const getAllBlogsHandler = async (req: Request, res: Response) => {
  const query = req.query;

  const blogs = await blogsService.findAllBlogs(
    (query as unknown) as PagingAndSortType
  );
  res.status(HttpStatus.Ok).send(blogs);
};
