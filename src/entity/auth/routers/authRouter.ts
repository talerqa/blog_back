import { Router } from "express";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validtion-result.middleware";
import {
  idValidationLoginOrEmail,
  idValidationPassword
} from "../../../core/middlewares/validation/params-auth.validation-middleware";
import { loginHandler } from "./handlers/login.handler";
import { authGuard, cookieGuard } from "./handlers/authGuard";
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
import { isRateLimit } from "../../../core/middlewares/isRateLimit.guard-middleware";

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

authRouter.get("/me", authGuard, meHandler);

//
// import { Router } from "express";
// import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validtion-result.middleware";
// import {
//   idValidationLoginOrEmail,
//   idValidationPassword
// } from "../../../core/middlewares/validation/params-auth.validation-middleware";
// import { loginHandler } from "./handlers/login.handler";
// import { authGuard, cookieGuard } from "./handlers/authGuard";
// import { meHandler } from "./handlers/me.handler";
// import { registrationHandler } from "./handlers/registration.handler";
// import {
//   idValidationCode,
//   idValidationUserEmail,
//   idValidationUserLogin,
//   idValidationUserPassword
// } from "../../../core/middlewares/validation/params-user.validation-middleware";
// import { registrationEmailResendingHandler } from "./handlers/registrationEmailResending.handler";
// import { registrationConfirmationHandler } from "./handlers/registrationConfirmation.handler";
// import { refreshTokenHandler } from "./handlers/refreshToken.handler";
// import { logoutHandler } from "./handlers/logout.handler";
// import { isRateLimit } from "../../../core/middlewares/isRateLimit.guard-middleware";
//
// export const authRouter = Router({});
//
// export class AuthRouterClass {
//   async login() {
//     await loginHandler;
//   }
//
//   async refreshToken() {
//     await refreshTokenHandler;
//   }
//
//   async logout() {
//     await logoutHandler;
//   }
//
//   async registrationConfirmation() {
//     await registrationConfirmationHandler;
//   }
//
//   async registration() {
//     await registrationHandler;
//   }
//
//   async registrationEmailResending() {
//     await registrationEmailResendingHandler;
//   }
//
//   async me() {
//     await meHandler;
//   }
// }
//
// const abc = new AuthRouterClass();
//
// authRouter.post(
//   "/login",
//   idValidationLoginOrEmail,
//   idValidationPassword,
//   inputValidationResultMiddleware,
//   isRateLimit,
//   abc.login
// );
//
// authRouter.post("/refresh-token", cookieGuard, abc.refreshToken);
//
// authRouter.post("/logout", cookieGuard, abc.logout);
//
// authRouter.post(
//   "/registration-confirmation",
//   isRateLimit,
//   idValidationCode,
//   inputValidationResultMiddleware,
//   abc.registrationConfirmation
// );
//
// authRouter.post(
//   "/registration",
//   idValidationUserLogin,
//   idValidationUserEmail,
//   idValidationUserPassword,
//   inputValidationResultMiddleware,
//   isRateLimit,
//   abc.registration
// );
// authRouter.post(
//   "/registration-email-resending",
//   idValidationUserEmail,
//   inputValidationResultMiddleware,
//   isRateLimit,
//   abc.registrationEmailResending
// );
//
// authRouter.get("/me", authGuard, abc.me);
