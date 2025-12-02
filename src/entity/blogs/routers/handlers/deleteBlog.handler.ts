import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/const/httpCodes";
import { blogsService } from "../../compositionRoot";

export const deleteBlogHandler = async (req: Request, res: Response) => {
  const id = req.params?.id as string;
  const blog = await blogsService.deleteBlogById(id);

  if (!blog) {
    res.status(HttpStatus.NotFound).send();
  }

  res.status(HttpStatus.NoContent).send();
};
