import { Request, Response } from "express";
import { postsService } from "../../services/posts.service";
import { PagingAndSortType } from "../../../../core/types/pagingAndSortType";
import { HttpStatus } from "../../../../core/const/httpCodes";

export const createPostHandler = async (req: Request, res: Response) => {
  const newBlog = await postsService.createPost(req.body);

  if (!newBlog) {
    res.status(HttpStatus.BadRequest).send();
  }

  res.status(HttpStatus.Created).send(newBlog);
};
