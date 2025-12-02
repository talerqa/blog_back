import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/const/httpCodes";
import { postsService } from "../../compositionRoot";

export const deletePostHandler = async (req: Request, res: Response) => {
  const id = req.params?.id as string;
  const blog = await postsService.deletePostById(id);

  if (!blog) {
    res.status(HttpStatus.NotFound).send();
  }

  res.status(HttpStatus.NoContent).send();
};
