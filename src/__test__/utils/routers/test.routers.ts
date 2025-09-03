import { Router } from "express";
import { HttpStatus } from "../../../core/const/httpCodes";
import { testRepository } from "../repositories/test.repositories";

export const testingRouter = Router({});

testingRouter.delete("/all-data", async (req, res) => {
  await testRepository.deleteBlogsAndPost();
  res.status(HttpStatus.NoContent).send();
});
