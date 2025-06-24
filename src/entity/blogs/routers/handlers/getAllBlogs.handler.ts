import { Request, Response } from "express";
import { PagingAndSortType } from "../../../../core/types/pagingAndSortType";
import { HttpStatus } from "../../../../core/types/httpCodes";
import { blogsRepository } from "../../repositories/blogs.repositories";

export const getAllBlogsHandler = async (req: Request, res: Response) => {
  const query = req.query;

  const blogs = blogsRepository.findAllBlogs(
    (query as unknown) as PagingAndSortType
  );
  res.status(HttpStatus.Ok).send(blogs);
};
