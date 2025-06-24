import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/types/httpCodes";
import { findBlogById } from "../../repositories/findBlogByIdQueryRepo";

export const getBlogByIdHandler = async (req: Request, res: Response) => {
  const id = req.params?.id as string;
  const blog = await findBlogById(id);
  if (!blog) {
    res.status(HttpStatus.NotFound).send();
  }
  res.status(HttpStatus.Ok).send(blog);
};
