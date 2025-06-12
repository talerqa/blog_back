import { Router } from "express";
import { HttpStatus } from "../../../core/types/httpCodes";
import {
  idValidationBLogIdPost,
  idValidationContentPost,
  idValidationParamId,
  idValidationShortDescriptionPost,
  idValidationTitlePost
} from "../../../core/middlewares/validation/params-post.validation-middleware";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validtion-result.middleware";
import { isAuthGuardMiddleware } from "../../../core/middlewares/isAuth.guard-middleware";
import { body } from "express-validator";
import { postsService } from "../application/posts.service";
import { paginationAndSortingValidation } from "../../../core/middlewares/isQueryParams.validation-middleware";
import { SortFiledBlogs } from "../../../core/types/sortFiledBlogs";

export const postsRouter = Router({});

postsRouter.get(
  "",
  paginationAndSortingValidation(SortFiledBlogs),
  async (req, res) => {
    const query = req.query;
    const blogs = await postsService.findAllPosts(query);
    res.status(HttpStatus.Ok).send(blogs);
  }
);

postsRouter.get(
  "/:id",
  idValidationParamId,
  inputValidationResultMiddleware,
  async (req, res) => {
    const id = req.params?.id;
    const blog = await postsService.findBlogById(id);

    if (!blog) {
      res.status(HttpStatus.NotFound).send();
    }
    res.status(HttpStatus.Ok).send(blog);
  }
);

postsRouter.post(
  "",
  isAuthGuardMiddleware,
  idValidationTitlePost,
  idValidationShortDescriptionPost,
  idValidationContentPost,
  idValidationBLogIdPost,
  inputValidationResultMiddleware,
  async (req, res) => {
    const newBlog = await postsService.createPost(req.body);

    if (!newBlog) {
      res.status(HttpStatus.BadRequest).send();
    }

    res.status(HttpStatus.Created).send(newBlog);
  }
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
  async (req, res) => {
    const id = req.params?.id;
    const blog = await postsService.updatePost(id, req.body);

    if (!blog) {
      res.status(HttpStatus.NotFound).send();
    }

    res.status(HttpStatus.NoContent).send();
  }
);

postsRouter.delete(
  "/:id",
  isAuthGuardMiddleware,
  idValidationParamId,
  inputValidationResultMiddleware,
  async (req, res) => {
    const id = req.params?.id;
    const blog = await postsService.deletePostById(id);

    if (!blog) {
      res.status(HttpStatus.NotFound).send();
    }

    res.status(HttpStatus.NoContent).send();
  }
);
