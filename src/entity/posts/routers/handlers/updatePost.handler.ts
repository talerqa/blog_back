import { Request, Response } from "express";
import { postsService } from "../../services/posts.service";
import { HttpStatus } from "../../../../core/const/httpCodes";

export const updatePostHandler = async (req: Request, res: Response) => {
  const id = req.params?.id as string;
  const blog = await postsService.updatePost(id, req.body);

  if (!blog) {
    res.status(HttpStatus.NotFound).send();
  }

  res.status(HttpStatus.NoContent).send();
};
