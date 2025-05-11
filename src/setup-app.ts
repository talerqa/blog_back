import express, {Express} from 'express';
import {blogsRouter} from "./blogs/routers/blogs.routers";
import {BLOGS_PATH, TESTING_PATH} from "./core/paths/paths";
import {setupSwagger} from "./core/swagger/setup-swagger";
import {testingRouter} from "./__test__/routers/test.routers";
import {isAuthGuardMiddleware} from "./core/middlewares/isAuth.guard-middleware";

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.use(BLOGS_PATH, blogsRouter)
  app.use(TESTING_PATH, testingRouter);
  setupSwagger(app);
  return app;
};