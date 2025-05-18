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
import {body} from "express-validator";
import {CreateBlogInputModel} from "../dto/createPostsInputModel";

export const postsRouter = Router({});

postsRouter.get('', async (req, res) => {
  const blogs = await postsRepository.findAllPosts()
  res.status(HttpStatus.Ok).send(blogs);
});

postsRouter.get('/:id', idValidationParamId, inputValidationResultMiddleware, async (req, res) => {
  const id = req.params?.id
  const blog = await postsRepository.findBlogById(id as string)

  if (!blog) {
    res.status(HttpStatus.NotFound).send();
  }
  res.status(HttpStatus.Ok).send(blog);
});

postsRouter.post('', isAuthGuardMiddleware, idValidationTitlePost, idValidationShortDescriptionPost, idValidationContentPost, idValidationBLogIdPost, inputValidationResultMiddleware, async (req, res,) => {
  const {title, shortDescription, content, blogId} = req.body
  const newBlog = await postsRepository.createBlog({
    title,
    shortDescription,
    content,
    blogId,
    createdAt: new Date().toISOString()
  } as CreateBlogInputModel)

  if (!newBlog) {
    res.status(HttpStatus.BadRequest).send();
  }

  res.status(HttpStatus.Created).send(newBlog);
})

postsRouter.put('/:id', body('').isLength({
  min: 3,
  max: 100
}), isAuthGuardMiddleware, idValidationTitlePost, idValidationShortDescriptionPost, idValidationContentPost, idValidationBLogIdPost, inputValidationResultMiddleware, async (req, res,) => {
  const id = req.params?.id;
  const {title, shortDescription, content, blogId} = req.body

  const blog = await postsRepository.updatePost(id, {title, shortDescription, content, blogId})

  if (!blog) {
    res.status(HttpStatus.NotFound).send()
  }

  res.status(HttpStatus.NoContent).send()
});

postsRouter.delete('/:id', isAuthGuardMiddleware, idValidationParamId, inputValidationResultMiddleware, async (req, res, next) => {
    const id = req.params?.id;
    const blog = await postsRepository.deletePostById(id)

    if (!blog) {
      res.status(HttpStatus.NotFound).send()
    }

    res.status(HttpStatus.NoContent).send()
  }
)
;


