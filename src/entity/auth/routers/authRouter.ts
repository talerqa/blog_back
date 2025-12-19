import { Router } from "express";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validtion-result.middleware";
import {
  idValidationLoginOrEmail,
  idValidationNewPassword,
  idValidationPassword
} from "../../../core/middlewares/validation/params-auth.validation-middleware";
import { loginHandler } from "./handlers/login.handler";
import { authGuard, cookieGuard } from "../../../core/guards/authGuard";
import { meHandler } from "./handlers/me.handler";
import { registrationHandler } from "./handlers/registration.handler";
import {
  idValidationCode,
  idValidationRecoveryCode,
  idValidationUserEmail,
  idValidationUserLogin,
  idValidationUserPassword
} from "../../../core/middlewares/validation/params-user.validation-middleware";
import { registrationEmailResendingHandler } from "./handlers/registrationEmailResending.handler";
import { registrationConfirmationHandler } from "./handlers/registrationConfirmation.handler";
import { refreshTokenHandler } from "./handlers/refreshToken.handler";
import { logoutHandler } from "./handlers/logout.handler";
import { isRateLimit } from "../../../core/middlewares/isRateLimit.guard-middleware";
import { passRecoveryHandler } from "./handlers/passRecovery.handler";
import { newPassRecoveryHandler } from "./handlers/newPassRecovery.handler";

export const authRouter = Router({});

authRouter.post(
  "/login",
  idValidationLoginOrEmail,
  idValidationPassword,
  inputValidationResultMiddleware,
  isRateLimit,
  loginHandler
);

authRouter.post("/refresh-token", cookieGuard, refreshTokenHandler);

authRouter.post("/logout", cookieGuard, logoutHandler);

authRouter.post(
  "/registration-confirmation",
  isRateLimit,
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
  isRateLimit,
  registrationHandler
);
authRouter.post(
  "/registration-email-resending",
  idValidationUserEmail,
  inputValidationResultMiddleware,
  isRateLimit,
  registrationEmailResendingHandler
);

authRouter.post(
  "/password-recovery",
  idValidationUserEmail,
  inputValidationResultMiddleware,
  isRateLimit,
  passRecoveryHandler
);
authRouter.post(
  "/new-password",
  isRateLimit,
  idValidationRecoveryCode,
  idValidationNewPassword,
  inputValidationResultMiddleware,
  newPassRecoveryHandler
);
authRouter.get("/me", authGuard, meHandler);
