import {Router} from 'express';
import {HttpStatus} from "../../core/types/httpCodes";
import {blogsRepository} from "../repositories/blogs.repositories";
import {CreateBlogInputModel} from "../dto/createBlogsInputModel";
import {
  idValidationDescriptionBlog,
  idValidationNameBlog,
  idValidationParamId,
  idValidationWebsiteUrlBlog
} from "../../core/middlewares/validation/params-blog.validation-middleware";
import {
  inputValidationResultMiddleware
} from "../../core/middlewares/validation/input-validtion-result.middleware";
import {isAuthGuardMiddleware} from "../../core/middlewares/isAuth.guard-middleware";

export const blogsRouter = Router({});

blogsRouter.get('', (req, res) => {
  const blogs = blogsRepository.findAllBlogs()
  res.status(HttpStatus.Ok).send(blogs);
});

blogsRouter.get('/:id', idValidationParamId, inputValidationResultMiddleware, (req, res) => {
  const id = req.params.id
  const blog = blogsRepository.findBlogById(id as string)
  if (!blog) {
    res.status(HttpStatus.NotFound).send(undefined);
  }
  res.status(HttpStatus.Ok).send(blog);
});

blogsRouter.post('', isAuthGuardMiddleware, idValidationNameBlog, idValidationDescriptionBlog, idValidationWebsiteUrlBlog, inputValidationResultMiddleware, (req, res,) => {
  const {description, name, websiteUrl} = req.body
  const newBlog = blogsRepository.createBlog({description, name, websiteUrl})
  res.status(HttpStatus.Created).send(newBlog);
})

blogsRouter.put('/:id', isAuthGuardMiddleware, idValidationParamId, idValidationNameBlog, idValidationDescriptionBlog, idValidationWebsiteUrlBlog, inputValidationResultMiddleware, (req, res,) => {
  const id = req.params.id;
  const {description, name, websiteUrl}: CreateBlogInputModel = req.body
  const blog = blogsRepository.updateBlog(id, {description, name, websiteUrl})

  if (!blog) {
    res.status(HttpStatus.NotFound).send(undefined)
  }

  res.status(HttpStatus.NoContent).send(blog)
});

blogsRouter.delete('/:id', isAuthGuardMiddleware, idValidationParamId, inputValidationResultMiddleware, (req, res, next) => {
    const id = req.params.id;
    const blog = blogsRepository.deleteBlogById(id)

    if (!blog) {
      res.status(HttpStatus.NotFound).send(undefined)
    }

    res.status(HttpStatus.NoContent).send(undefined)
  }
)
;


