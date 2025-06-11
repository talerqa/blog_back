import express, { Express } from "express";
import { blogsRouter } from "./entity/blogs/routers/blogs.routers";
import { BLOGS_PATH, POSTS_PATH, TESTING_PATH } from "./core/paths/paths";
import { setupSwagger } from "./core/swagger/setup-swagger";
import { testingRouter } from "./__test__/routers/test.routers";
import { postsRouter } from "./entity/posts/routers/posts.routers";

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.use(BLOGS_PATH, blogsRouter);
  app.use(POSTS_PATH, postsRouter);
  app.use(TESTING_PATH, testingRouter);
  setupSwagger(app);
  return app;
};
