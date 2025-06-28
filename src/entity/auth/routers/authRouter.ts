import { Router } from "express";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validtion-result.middleware";
import {
  idValidationLoginOrEmail,
  idValidationPassword
} from "../../../core/middlewares/validation/params-auth.validation-middleware";
import { loginHandler } from "./handlers/login.handler";

export const authRouter = Router({});

authRouter.post(
  "",
  // isAuthGuardMiddleware,
  idValidationLoginOrEmail,
  idValidationPassword,
  inputValidationResultMiddleware,
  loginHandler
);
