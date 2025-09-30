import { Router } from "express";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validtion-result.middleware";
import {
  idValidationLoginOrEmail,
  idValidationPassword
} from "../../../core/middlewares/validation/params-auth.validation-middleware";
import { loginHandler } from "./handlers/login.handler";
import { cookieGuard, authGuard } from "./handlers/authGuard";
import { meHandler } from "./handlers/me.handler";
import { registrationHandler } from "./handlers/registration.handler";
import {
  idValidationCode,
  idValidationUserEmail,
  idValidationUserLogin,
  idValidationUserPassword
} from "../../../core/middlewares/validation/params-user.validation-middleware";
import { registrationEmailResendingHandler } from "./handlers/registrationEmailResending.handler";
import { registrationConfirmationHandler } from "./handlers/registrationConfirmation.handler";
import { refreshTokenHandler } from "./handlers/refreshToken.handler";
import { logoutHandler } from "./handlers/logout.handler";

export const authRouter = Router({});

authRouter.post(
  "/login",
  idValidationLoginOrEmail,
  idValidationPassword,
  inputValidationResultMiddleware,
  loginHandler
);

authRouter.post("/refresh-token", cookieGuard, refreshTokenHandler);

authRouter.post("/logout", cookieGuard, logoutHandler);

authRouter.post(
  "/registration-confirmation",
  idValidationCode,
  inputValidationResultMiddleware,
  registrationConfirmationHandler
);

authRouter.post(
  "/registration",
  idValidationUserLogin,
  idValidationUserEmail,
  idValidationUserPassword,
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
