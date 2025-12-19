import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/const/httpCodes";
import { commentService } from "../../compositionRoot";

export const getCommentByIdHandler = async (req: Request, res: Response) => {
  const id = req.params?.id as string;
  const comment = await commentService.findCommentById(id);

  if (!comment) {
    res.status(HttpStatus.NotFound).send();
  }
  res.status(HttpStatus.Ok).send(comment);
};
