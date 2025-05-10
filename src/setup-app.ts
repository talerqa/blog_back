import express, {Express} from 'express';
import {blogsRouter} from "./blogs/routers/blogs.routers";
import {BLOGS_PATH, TESTING_PATH} from "./core/paths/paths";
import {setupSwagger} from "./core/swagger/setup-swagger";
import {testingRouter} from "./__test__/routers/test.routers";

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.get('/', (req, res, next) => {
    res.status(200).send('hello world!!!');

  });


  app.use(BLOGS_PATH, blogsRouter)
  app.use(TESTING_PATH, testingRouter);
  setupSwagger(app);
  return app;
};