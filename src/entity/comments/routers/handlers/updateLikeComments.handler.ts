import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/const/httpCodes";
import { commentService } from "../../compositionRoot";

export const updateLikeCommentsHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params?.commentId as string;

    const userId = req?.headers?.userId as string;
    const likeStatus = req?.body?.likeStatus as string;

    const comment = await commentService.updateLikeComments(
      id,
      userId,
      likeStatus
    );

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
