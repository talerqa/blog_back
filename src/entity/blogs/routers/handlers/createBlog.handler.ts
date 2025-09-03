import { Request, Response } from "express";
import { blogsService } from "../../application/blogs.service";
import { HttpStatus } from "../../../../core/const/httpCodes";

export const createBlogHandler = async (req: Request, res: Response) => {
  const newBlog = await blogsService.createBlog(req.body);

  if (!newBlog) {
    res.status(HttpStatus.BadRequest).send();
  }

  res.status(HttpStatus.Created).send(newBlog);
};
