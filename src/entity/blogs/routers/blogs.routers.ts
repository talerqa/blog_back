import { Router } from "express";
import { HttpStatus } from "../../../core/types/httpCodes";
import {
  idValidationDescriptionBlog,
  idValidationNameBlog,
  idValidationParamId,
  idValidationWebsiteUrlBlog
} from "../../../core/middlewares/validation/params-blog.validation-middleware";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validtion-result.middleware";
import { isAuthGuardMiddleware } from "../../../core/middlewares/isAuth.guard-middleware";
import { blogsService } from "../application/blogs.service";
import { paginationAndSortingValidation } from "../../../core/middlewares/isQueryParams.validation-middleware";
import { SortFiledBlogs } from "../../../core/types/sortFiledBlogs";

export const blogsRouter = Router({});

blogsRouter.get(
  "",
  paginationAndSortingValidation(SortFiledBlogs),
  async (req, res) => {
    const query = req.query;

    const blogs = await blogsService.findAllBlogs(query);
    res.status(HttpStatus.Ok).send(blogs);
  }
);

blogsRouter.get(
  "/:id",
  idValidationParamId,
  inputValidationResultMiddleware,
  async (req, res) => {
    const id = req.params?.id;
    const blog = await blogsService.findBlogById(id);
    if (!blog) {
      res.status(HttpStatus.NotFound).send();
    }
    res.status(HttpStatus.Ok).send(blog);
  }
);

blogsRouter.post(
  "",
  isAuthGuardMiddleware,
  idValidationNameBlog,
  idValidationDescriptionBlog,
  idValidationWebsiteUrlBlog,
  inputValidationResultMiddleware,
  async (req, res) => {
    const newBlog = await blogsService.createBlog(req.body);

    if (!newBlog) {
      res.status(HttpStatus.BadRequest).send();
    }

    res.status(HttpStatus.Created).send(newBlog);
  }
);

blogsRouter.put(
  "/:id",
  isAuthGuardMiddleware,
  idValidationParamId,
  idValidationNameBlog,
  idValidationDescriptionBlog,
  idValidationWebsiteUrlBlog,
  inputValidationResultMiddleware,
  async (req, res) => {
    const id = req.params?.id;

    const blog = await blogsService.updateBlog(id, req.body);

    if (!blog) {
      res.status(HttpStatus.NotFound).send();
    }

    res.status(HttpStatus.NoContent).send();
  }
);

blogsRouter.delete(
  "/:id",
  isAuthGuardMiddleware,
  idValidationParamId,
  inputValidationResultMiddleware,
  async (req, res) => {
    const id = req.params?.id;
    const blog = await blogsService.deleteBlogById(id);

    if (!blog) {
      res.status(HttpStatus.NotFound).send();
    }

    res.status(HttpStatus.NoContent).send();
  }
);
