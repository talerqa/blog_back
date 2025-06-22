import { Request, Response } from "express";
import { postsService } from "../../application/posts.service";
import { HttpStatus } from "../../../../core/types/httpCodes";

export const updatePostHandler = async (req: Request, res: Response) => {
  const id = req.params?.id as string;
  const blog = await postsService.updatePost(id, req.body);

  if (!blog) {
    res.status(HttpStatus.NotFound).send();
  }

  res.status(HttpStatus.NoContent).send();
};
