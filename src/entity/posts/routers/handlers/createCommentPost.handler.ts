import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/types/httpCodes";
import { commentService } from "../../../comments/service/comment.service";

export const createCommentPostHandler = async (req: Request, res: Response) => {
  try {
    const userId = req?.headers.userId;

    const postId = req?.params?.postId as string;
    const { content } = req?.body;

    const dto = {
      userId,
      postId,
      content
    };

    const comment = await commentService.createComment(dto as any);

    if (!comment) {
      res.status(HttpStatus.BadRequest).send(comment);
    }

    res.status(HttpStatus.Created).send(comment);
  } catch (e) {
    const err = e as Error;
    if (err.message === "postDontExist") {
      res.status(HttpStatus.NotFound).json();
    }
  }
};
