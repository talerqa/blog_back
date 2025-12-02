import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/const/httpCodes";
import { postsService } from "../../compositionRoot";

export const getPostByIdHandler = async (req: Request, res: Response) => {
  const id = req.params?.id as string;
  const blog = await postsService.findPostById(id);

  if (!blog) {
    res.status(HttpStatus.NotFound).send();
  }
  res.status(HttpStatus.Ok).send(blog);
};
