import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/const/httpCodes";
import { postsService } from "../../compositionRoot";

export const updateLikePostsHandler = async (req: Request, res: Response) => {
  try {
    const id = req.params?.postId as string;
    const userId = req?.headers?.userId as string;
    const likeStatus = req?.body?.likeStatus as string;

    const comment = await postsService.updateLikeComments(
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
