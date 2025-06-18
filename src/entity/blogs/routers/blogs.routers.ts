import { Request, Response, Router } from "express";
import { HttpStatus } from "../../../core/types/httpCodes";
import {
  idValidationDescriptionBlog,
  idValidationNameBlog,
  idValidationParamBlogId,
  idValidationParamId,
  idValidationWebsiteUrlBlog
} from "../../../core/middlewares/validation/params-blog.validation-middleware";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validtion-result.middleware";
import { isAuthGuardMiddleware } from "../../../core/middlewares/isAuth.guard-middleware";
import { blogsService } from "../application/blogs.service";
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
import { PagingAndSortType } from "../../../core/types/pagingAndSortType";

export const blogsRouter = Router({});

blogsRouter.get(
  "",
  paginationAndSortingValidation(SortFiledBlogs),
  async (req: Request, res: Response) => {
    const query = req.query;

    const blogs = await blogsService.findAllBlogs(
      (query as unknown) as PagingAndSortType
    );
    res.status(HttpStatus.Ok).send(blogs);
  }
);

blogsRouter.get(
  "/:id",
  idValidationParamId,
  inputValidationResultMiddleware,
  async (req: Request, res: Response) => {
    const id = req.params?.id as string;
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
  async (req: Request, res: Response) => {
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
  async (req: Request, res: Response) => {
    const id = req.params?.id as string;

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
  async (req: Request, res: Response) => {
    const id = req.params?.id as string;
    const blog = await blogsService.deleteBlogById(id);

    if (!blog) {
      res.status(HttpStatus.NotFound).send();
    }

    res.status(HttpStatus.NoContent).send();
  }
);

blogsRouter.get(
  "/:blogId/posts",
  paginationAndSortingValidation(SortFiledPost),
  idValidationParamBlogId,
  inputValidationResultMiddleware,
  async (req: Request, res: Response) => {
    const id = req.params?.blogId as string;
    const query = req.query;
    const posts = await blogsService.findAllPostByBlogId(
      id,
      (query as unknown) as PagingAndSortType
    );

    if (!posts) {
      res.status(HttpStatus.NotFound).send();
    }
    res.status(HttpStatus.Ok).send(posts);
  }
);

blogsRouter.post(
  "/:blogId/posts",
  isAuthGuardMiddleware,
  idValidationParamBlogId,
  idValidationTitlePost,
  idValidationShortDescriptionPost,
  idValidationContentPost,
  inputValidationResultMiddleware,
  async (req: Request, res: Response) => {
    const id = req.params?.blogId as string;
    const body = req.body;

    const posts = await blogsService.createPostByBlogId(id, body);

    if (!posts) {
      res.status(HttpStatus.NotFound).send();
    }
    res.status(HttpStatus.Created).send(posts);
  }
);
