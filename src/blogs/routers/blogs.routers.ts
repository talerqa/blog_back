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
import {Blog} from "../types/blog";
import {WithoutId} from "mongodb";

export const blogsRouter = Router({});

blogsRouter.get('', async (req, res) => {
  const blogs = await blogsRepository.findAllBlogs()
  res.status(HttpStatus.Ok).send(blogs);
});

blogsRouter.get('/:id', idValidationParamId, inputValidationResultMiddleware, async (req, res) => {
  const id = req.params.id
  const blog = await blogsRepository.findBlogById(id as string)
  if (!blog) {
    res.status(HttpStatus.NotFound).send();
  }
  res.status(HttpStatus.Ok).send(blog);
});

blogsRouter.post('', isAuthGuardMiddleware, idValidationNameBlog, idValidationDescriptionBlog, idValidationWebsiteUrlBlog, inputValidationResultMiddleware, async (req, res,) => {

  const body = {
    description: req.body.description,
    name: req.body.name,
    websiteUrl: req.body.websiteUrl,
    createdAt: new Date().toISOString(),
    isMembership: false
  }

  const newBlog = await blogsRepository.createBlog(body as WithoutId<Blog>)

  res.status(HttpStatus.Created).send(newBlog);
})

blogsRouter.put('/:id', isAuthGuardMiddleware, idValidationParamId, idValidationNameBlog, idValidationDescriptionBlog, idValidationWebsiteUrlBlog, inputValidationResultMiddleware, async (req, res,) => {
  const id = req.params.id;
  const {description, name, websiteUrl, isMembership}: CreateBlogInputModel = req.body
  const blog = await blogsRepository.updateBlog(id, {description, name, websiteUrl, isMembership})

  if (!blog) {
    res.status(HttpStatus.NotFound).send()
  }

  res.status(HttpStatus.NoContent).send()
});

blogsRouter.delete('/:id', isAuthGuardMiddleware, idValidationParamId, inputValidationResultMiddleware, async (req, res, next) => {
    const id = req.params.id;
    const blog = await blogsRepository.deleteBlogById(id)

    if (blog === -1) {
      res.status(HttpStatus.NotFound).send()
    }

    res.status(HttpStatus.NoContent).send()
  }
)
;


