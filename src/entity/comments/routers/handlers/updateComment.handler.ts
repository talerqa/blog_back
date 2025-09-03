import { Request, Response } from "express";
import { commentService } from "../../service/comment.service";
import { HttpStatus } from "../../../../core/const/httpCodes";

export const updateCommentHandler = async (req: Request, res: Response) => {
  try {
    const id = req.params?.commentId as string;

    const userId = req?.headers.userId as string;
    const comment = await commentService.updateComment(id, userId, req.body);

    if (!comment) {
      res.status(HttpStatus.NotFound).send();
    }

    res.status(HttpStatus.NoContent).send();
  } catch (e) {
    const err = e as Error;
    if (err.message === "notUserComment") {
      res.status(HttpStatus.Forbidden).send();
    }
  }
};
