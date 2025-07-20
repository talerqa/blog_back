import { Router } from "express";
import {
  idValidationCommentId,
  idValidationContentComment,
  idValidationParamId
} from "../../../core/middlewares/validation/params-post.validation-middleware";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validtion-result.middleware";
import { getCommentByIdHandler } from "./handlers/getCommentById.handler";
import { updateCommentHandler } from "./handlers/updateComment.handler";
import { deleteCommentHandler } from "./handlers/deleteComment.handler";
import { authGuard } from "../../auth/routers/handlers/authGuard";

export const commentsRouter = Router({});

commentsRouter.get(
  "/:id",
  authGuard,
  idValidationParamId,
  inputValidationResultMiddleware,
  getCommentByIdHandler
);

commentsRouter.put(
  "/:commentId",
  authGuard,
  idValidationCommentId,
  idValidationContentComment,
  inputValidationResultMiddleware,
  updateCommentHandler
);

commentsRouter.delete(
  "/:commentId",
  authGuard,
  idValidationCommentId,
  inputValidationResultMiddleware,
  deleteCommentHandler
);
