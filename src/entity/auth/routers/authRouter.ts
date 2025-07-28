import { Router } from "express";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validtion-result.middleware";
import {
  idValidationLoginOrEmail,
  idValidationPassword
} from "../../../core/middlewares/validation/params-auth.validation-middleware";
import { loginHandler } from "./handlers/login.handler";
import { authGuard } from "./handlers/authGuard";
import { meHandler } from "./handlers/me.handler";
import { registrationHandler } from "./handlers/registration.handler";
import {
  idValidationCode,
  idValidationUserEmail,
  idValidationUserLogin
} from "../../../core/middlewares/validation/params-user.validation-middleware";
import { registrationEmailResendingHandler } from "./handlers/registrationEmailResending.handler";
import { registrationConfirmationHandler } from "./handlers/registrationConfirmation.handler";

export const authRouter = Router({});

authRouter.post(
  "/login",
  idValidationLoginOrEmail,
  idValidationPassword,
  inputValidationResultMiddleware,
  loginHandler
);

authRouter.post(
  "/registration-confirmation",
  idValidationCode,
  inputValidationResultMiddleware,
  registrationConfirmationHandler
);

authRouter.post(
  "/registration",
  idValidationUserLogin,
  idValidationPassword,
  inputValidationResultMiddleware,
  registrationHandler
);
authRouter.post(
  "/registration-email-resending",
  idValidationUserEmail,
  inputValidationResultMiddleware,
  registrationEmailResendingHandler
);

authRouter.get("/me", authGuard, meHandler);
