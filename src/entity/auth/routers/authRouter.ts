import { Router } from "express";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validtion-result.middleware";
import {
  idValidationLoginOrEmail,
  idValidationPassword
} from "../../../core/middlewares/validation/params-auth.validation-middleware";
import { loginHandler } from "./handlers/login.handler";
import { authGuard } from "./handlers/authGuard";
import { meHandler } from "./handlers/me.handler";

export const authRouter = Router({});

authRouter.post(
  "/login",
  idValidationLoginOrEmail,
  idValidationPassword,
  inputValidationResultMiddleware,
  loginHandler
);

authRouter.get("/me", authGuard, meHandler);
