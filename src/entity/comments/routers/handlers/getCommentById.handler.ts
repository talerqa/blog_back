import { Request, Response } from "express";
import { commentService } from "../../service/comment.service";
import { HttpStatus } from "../../../../core/types/httpCodes";

export const getCommentByIdHandler = async (req: Request, res: Response) => {
  const id = req.params?.id as string;
  const comment = await commentService.findCommentById(id);

  if (!comment) {
    res.status(HttpStatus.NotFound).send();
  }
  res.status(HttpStatus.Ok).send(comment);
};
