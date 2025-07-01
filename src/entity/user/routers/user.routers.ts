import { Router } from "express";
import { idValidationParamId } from "../../../core/middlewares/validation/params-blog.validation-middleware";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validtion-result.middleware";
import { isAuthGuardMiddleware } from "../../../core/middlewares/isAuth.guard-middleware";
import { paginationAndSortingValidation } from "../../../core/middlewares/isQueryParams.validation-middleware";
import { SortFiledBlogs } from "../../../core/types/sortFiledBlogs";
import { getAllUsersHandler } from "./handlers/getAllUsers.handler";
import { createUserHandler } from "./handlers/createUser.handler";
import { deleteUserHandler } from "./handlers/deleteUser.handler";
import {
  idValidationUserEmail,
  idValidationUserLogin
} from "../../../core/middlewares/validation/params-user.validation-middleware";

export const userRouter = Router({});

userRouter.get(
  "",
  paginationAndSortingValidation(SortFiledBlogs),
  getAllUsersHandler
);

userRouter.post(
  "",
  isAuthGuardMiddleware,
  idValidationUserLogin,
  idValidationUserEmail,
  // idValidationUserPassword,
  inputValidationResultMiddleware,
  createUserHandler
);

userRouter.delete(
  "/:id",
  isAuthGuardMiddleware,
  idValidationParamId,
  inputValidationResultMiddleware,
  deleteUserHandler
);
