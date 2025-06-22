import { Router } from "express";
import {
  idValidationDescriptionBlog,
  idValidationNameBlog,
  idValidationParamBlogId,
  idValidationParamId,
  idValidationWebsiteUrlBlog
} from "../../../core/middlewares/validation/params-blog.validation-middleware";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validtion-result.middleware";
import { isAuthGuardMiddleware } from "../../../core/middlewares/isAuth.guard-middleware";
import { paginationAndSortingValidation } from "../../../core/middlewares/isQueryParams.validation-middleware";
import {
  SortFiledBlogs,
  SortFiledPost
} from "../../../core/types/sortFiledBlogs";
import {
  idValidationContentPost,
  idValidationShortDescriptionPost,
  idValidationTitlePost
} from "../../../core/middlewares/validation/params-post.validation-middleware";
import { getAllBlogsHandler } from "./handlers/getAllBlogs.handler";
import { getBlogByIdHandler } from "./handlers/getBlogById.handler";
import { createBlogHandler } from "./handlers/createBlog.handler";
import { updateBlogHandler } from "./handlers/updateBlog.handler";
import { deleteBlogHandler } from "./handlers/deleteBlog.handler";
import { getAllPostsByBlogIdHandler } from "./handlers/getAllPostsByBlogId.handler";
import { createPostByBlogIdHandler } from "./handlers/createPostByBlogId.handler";

export const blogsRouter = Router({});

blogsRouter.get(
  "",
  paginationAndSortingValidation(SortFiledBlogs),
  getAllBlogsHandler
);

blogsRouter.get(
  "/:id",
  idValidationParamId,
  inputValidationResultMiddleware,
  getBlogByIdHandler
);

blogsRouter.post(
  "",
  isAuthGuardMiddleware,
  idValidationNameBlog,
  idValidationDescriptionBlog,
  idValidationWebsiteUrlBlog,
  inputValidationResultMiddleware,
  createBlogHandler
);

blogsRouter.put(
  "/:id",
  isAuthGuardMiddleware,
  idValidationParamId,
  idValidationNameBlog,
  idValidationDescriptionBlog,
  idValidationWebsiteUrlBlog,
  inputValidationResultMiddleware,
  updateBlogHandler
);

blogsRouter.delete(
  "/:id",
  isAuthGuardMiddleware,
  idValidationParamId,
  inputValidationResultMiddleware,
  deleteBlogHandler
);

blogsRouter.get(
  "/:blogId/posts",
  paginationAndSortingValidation(SortFiledPost),
  idValidationParamBlogId,
  inputValidationResultMiddleware,
  getAllPostsByBlogIdHandler
);

blogsRouter.post(
  "/:blogId/posts",
  isAuthGuardMiddleware,
  idValidationParamBlogId,
  idValidationTitlePost,
  idValidationShortDescriptionPost,
  idValidationContentPost,
  inputValidationResultMiddleware,
  createPostByBlogIdHandler
);
