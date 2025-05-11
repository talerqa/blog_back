import {Router} from 'express';
import {HttpStatus} from "../../core/types/httpCodes";
import {
  idValidationBLogIdPost,
  idValidationContentPost,
  idValidationParamId,
  idValidationShortDescriptionPost,
  idValidationTitlePost
} from "../../core/middlewares/validation/params-post.validation-middleware";
import {
  inputValidationResultMiddleware
} from "../../core/middlewares/validation/input-validtion-result.middleware";
import {postsRepository} from "../repositories/posts.repositories";
import {isAuthGuardMiddleware} from "../../core/middlewares/isAuth.guard-middleware";

export const postsRouter = Router({});

postsRouter.get('', (req, res) => {
  const blogs = postsRepository.findAllPosts()
  res.status(HttpStatus.Ok).send(blogs);
});

postsRouter.get('/:id', idValidationParamId, inputValidationResultMiddleware, (req, res) => {
  const id = req.params.id
  const blog = postsRepository.findBlogById(id as string)

  if (!blog) {
    res.status(HttpStatus.NotFound).send();
  }
  res.status(HttpStatus.Ok).send(blog);
});

postsRouter.post('', isAuthGuardMiddleware, idValidationTitlePost, idValidationShortDescriptionPost, idValidationContentPost, idValidationBLogIdPost, inputValidationResultMiddleware, (req, res,) => {
  const {title, shortDescription, content, blogId} = req.body
  const newBlog = postsRepository.createBlog({title, shortDescription, content, blogId})

  if (!newBlog) {
    res.status(HttpStatus.BadRequest).send();
  }

  res.status(HttpStatus.Created).send(newBlog);
})

postsRouter.put('/:id', isAuthGuardMiddleware, idValidationTitlePost, idValidationShortDescriptionPost, idValidationContentPost, idValidationBLogIdPost, inputValidationResultMiddleware, (req, res,) => {
  const id = req.params.id;
  const {title, shortDescription, content, blogId} = req.body

  const blog = postsRepository.updatePost(id, {title, shortDescription, content, blogId})

  if (!blog) {
    res.status(HttpStatus.NotFound).send()
  }

  res.status(HttpStatus.NoContent).send()
});

postsRouter.delete('/:id', isAuthGuardMiddleware, idValidationParamId, inputValidationResultMiddleware, (req, res, next) => {
    const id = req.params.id;
    const blog = postsRepository.deletePostById(id)

    if (blog === -1) {
      res.status(HttpStatus.NotFound).send()
    }

    res.status(HttpStatus.NoContent).send()
  }
)
;


