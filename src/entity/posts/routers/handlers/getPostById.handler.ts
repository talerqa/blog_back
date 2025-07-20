import { Request, Response } from "express";
import { postsService } from "../../application/posts.service";
import { HttpStatus } from "../../../../core/types/httpCodes";

export const getPostByIdHandler = async (req: Request, res: Response) => {
  const id = req.params?.id as string;
  const blog = await postsService.findPostById(id);

  if (!blog) {
    res.status(HttpStatus.NotFound).send();
  }
  res.status(HttpStatus.Ok).send(blog);
};
