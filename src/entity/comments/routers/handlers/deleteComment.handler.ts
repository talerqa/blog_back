import { Request, Response } from "express";
import { commentService } from "../../service/comment.service";
import { HttpStatus } from "../../../../core/types/httpCodes";

export const deleteCommentHandler = async (req: Request, res: Response) => {
  try {
    const id = req.params?.commentId as string;
    const userId = req?.headers.userId;

    const blog = await commentService.deleteCommentById(id, userId);

    if (!blog) {
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
