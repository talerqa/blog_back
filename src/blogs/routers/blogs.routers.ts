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

export const blogsRouter = Router({});

blogsRouter.get('', (req, res) => {
  const blogs = blogsRepository.findAllBlogs()

  res.status(HttpStatus.Ok).send(blogs);
});

blogsRouter.get('/:id', idValidationParamId, idValidationNameBlog, idValidationDescriptionBlog, idValidationWebsiteUrlBlog, (req, res) => {
  const id = req.params.id
  const driver = blogsRepository.findBlogById(id as string)
  // if (!driver) {
  //   res
  //     .status(HttpStatus.NotFound)
  //     .send(
  //       createErrorMessages([{field: 'id', message: "Blog doesn't exist"}]),
  //     );
  //   return;
  // }
  res.status(HttpStatus.Ok).send(driver);
});

blogsRouter.post('', (req, res) => {
  const {description, name, websiteUrl} = req.body
  const newBlog = blogsRepository.createBlog({description, name, websiteUrl})
  res.status(HttpStatus.Created).send(newBlog);
})

blogsRouter.put('/:id', idValidationParamId, idValidationNameBlog, idValidationDescriptionBlog, idValidationWebsiteUrlBlog, (req, res) => {
  const id = req.params.id;
  const {description, name, websiteUrl}: CreateBlogInputModel = req.body
  blogsRepository.updateBlog(id, {description, name, websiteUrl})
  res.status(HttpStatus.NoContent).send()
});

blogsRouter.delete('/:id', idValidationParamId, (req, res) => {
    const id = req.params.id;
    blogsRepository.deleteBlogById(id)
    res.status(HttpStatus.NoContent).send('delete video by id')
  }
)
;


