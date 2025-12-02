import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/const/httpCodes";
import { blogsService } from "../../compositionRoot";

export const createPostByBlogIdHandler = async (
  req: Request,
  res: Response
) => {
  const id = req.params?.blogId as string;
  const body = req.body;

  const posts = await blogsService.createPostByBlogId(id, body);

  if (!posts) {
    res.status(HttpStatus.NotFound).send();
  }
  res.status(HttpStatus.Created).send(posts);
};
