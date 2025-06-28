import { Request, Response } from "express";
import { PagingAndSortType } from "../../../../core/types/pagingAndSortType";
import { HttpStatus } from "../../../../core/types/httpCodes";
import { findAllUserQueryRepo } from "../../repositories/findAllUserQueryRepo";

export const getAllUsersHandler = async (req: Request, res: Response) => {
  const query = req.query;

  const blogs = await findAllUserQueryRepo(
    (query as unknown) as PagingAndSortType
  );
  res.status(HttpStatus.Ok).send(blogs);
};
