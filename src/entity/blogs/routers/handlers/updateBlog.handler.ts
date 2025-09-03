import { Request, Response } from "express";
import { blogsService } from "../../application/blogs.service";
import { HttpStatus } from "../../../../core/const/httpCodes";

export const updateBlogHandler = async (req: Request, res: Response) => {
  const id = req.params?.id as string;

  const blog = await blogsService.updateBlog(id, req.body);

  if (!blog) {
    res.status(HttpStatus.NotFound).send();
  }

  res.status(HttpStatus.NoContent).send();
};
