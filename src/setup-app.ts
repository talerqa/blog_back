import express, { Express } from "express";
import { blogsRouter } from "./entity/blogs/routers/blogs.routers";
import {
  AUTH_PATH,
  BLOGS_PATH,
  COMMENTS_PATH,
  POSTS_PATH,
  SECURITY_PATH,
  TESTING_PATH,
  USER_PATH
} from "./core/paths/paths";
import { setupSwagger } from "./core/swagger/setup-swagger";
import { testingRouter } from "./__test__/utils/routers/test.routers";
import { postsRouter } from "./entity/posts/routers/posts.routers";
import { userRouter } from "./entity/user/routers/user.routers";
import { authRouter } from "./entity/auth/routers/authRouter";
import { commentsRouter } from "./entity/comments/routers/comments.routers";
import cookieParser from "cookie-parser";
import { sessionsRouter } from "./entity/security/routers/security.routers";

export const setupApp = (app: Express) => {
  app.use(express.json());
  app.use(cookieParser());

  app.use(BLOGS_PATH, blogsRouter);
  app.use(POSTS_PATH, postsRouter);
  app.use(TESTING_PATH, testingRouter);
  app.use(USER_PATH, userRouter);
  app.use(AUTH_PATH, authRouter);
  app.use(COMMENTS_PATH, commentsRouter);
  app.use(SECURITY_PATH, sessionsRouter);

  setupSwagger(app);
  return app;
};
