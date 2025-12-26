import { Router } from "express";
import {
  idValidationBLogIdPost,
  idValidationContentComment,
  idValidationContentPost,
  idValidationParamId,
  idValidationPostId,
  idValidationShortDescriptionPost,
  idValidationTitlePost
} from "../../../core/middlewares/validation/params-post.validation-middleware";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validtion-result.middleware";
import { isAuthGuardMiddleware } from "../../../core/middlewares/isAuth.guard-middleware";
import { body } from "express-validator";
import { paginationAndSortingValidation } from "../../../core/middlewares/isQueryParams.validation-middleware";
import { SortFiledBlogs } from "../../../core/types/sortFiledBlogs";
import { getAllPostsHandler } from "./handlers/getAllPosts.handler";
import { getPostByIdHandler } from "./handlers/getPostById.handler";
import { createPostHandler } from "./handlers/createPost.handler";
import { updatePostHandler } from "./handlers/updatePost.handler";
import { deletePostHandler } from "./handlers/deletePost.handler";
import { authGuard, isAuthUserGuard } from "../../../core/guards/authGuard";
import { createCommentPostHandler } from "./handlers/createCommentPost.handler";
import { getCommentByPostIdHandler } from "./handlers/getCommentByPostId.handler";

export const postsRouter = Router({});

postsRouter.get(
  "",
  paginationAndSortingValidation(SortFiledBlogs),
  getAllPostsHandler
);

postsRouter.get(
  "/:id",
  idValidationParamId,
  inputValidationResultMiddleware,
  getPostByIdHandler
);

postsRouter.post(
  "",
  isAuthGuardMiddleware,
  idValidationTitlePost,
  idValidationShortDescriptionPost,
  idValidationContentPost,
  idValidationBLogIdPost,
  inputValidationResultMiddleware,
  createPostHandler
);

postsRouter.put(
  "/:id",
  body("").isLength({
    min: 3,
    max: 100
  }),
  isAuthGuardMiddleware,
  idValidationTitlePost,
  idValidationShortDescriptionPost,
  idValidationContentPost,
  idValidationBLogIdPost,
  inputValidationResultMiddleware,
  updatePostHandler
);

postsRouter.delete(
  "/:id",
  isAuthGuardMiddleware,
  idValidationParamId,
  inputValidationResultMiddleware,
  deletePostHandler
);

postsRouter.post(
  "/:postId/comments",
  authGuard,
  idValidationPostId,
  idValidationContentComment,
  inputValidationResultMiddleware,
  createCommentPostHandler
);

postsRouter.get(
  "/:postId/comments",
  isAuthUserGuard,
  idValidationPostId,
  inputValidationResultMiddleware,
  getCommentByPostIdHandler
);
