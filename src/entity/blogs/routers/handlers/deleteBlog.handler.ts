import { Request, Response } from "express";
import { blogsService } from "../../application/blogs.service";
import { HttpStatus } from "../../../../core/types/httpCodes";

export const deleteBlogHandler = async (req: Request, res: Response) => {
  const id = req.params?.id as string;
  const blog = await blogsService.deleteBlogById(id);

  if (!blog) {
    res.status(HttpStatus.NotFound).send();
  }

  res.status(HttpStatus.NoContent).send();
};
