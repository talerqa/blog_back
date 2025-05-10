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
  const driver = blogsRepository.findBlogById(id as string)
  res.status(HttpStatus.Ok).send(driver);
});

blogsRouter.post('', idValidationNameBlog, idValidationDescriptionBlog, idValidationWebsiteUrlBlog, inputValidationResultMiddleware, (req, res,) => {
  const {description, name, websiteUrl} = req.body
  const newBlog = blogsRepository.createBlog({description, name, websiteUrl})
  res.status(HttpStatus.Created).send(newBlog);
})

blogsRouter.put('/:id', idValidationParamId, idValidationNameBlog, idValidationDescriptionBlog, idValidationWebsiteUrlBlog, inputValidationResultMiddleware, (req, res,) => {
  const id = req.params.id;
  const {description, name, websiteUrl}: CreateBlogInputModel = req.body
  blogsRepository.updateBlog(id, {description, name, websiteUrl})
  res.status(HttpStatus.NoContent).send()
});

blogsRouter.delete('/:id', idValidationParamId, inputValidationResultMiddleware, (req, res, next) => {
    const id = req.params.id;
    blogsRepository.deleteBlogById(id)
    res.status(HttpStatus.NoContent).send('delete video by id')
  }
)
;


