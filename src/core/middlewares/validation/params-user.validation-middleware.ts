import { body } from "express-validator";

export const idValidationUserEmail = body("email")
  .exists()
  .withMessage("email is required")
  .isString()
  .withMessage("email must be a string")
  .isEmail()
  .withMessage("email wil be pattern");

export const idValidationUserLogin = body("login")
  .exists()
  .withMessage("login is required")
  .isString()
  .withMessage("login must be a string")
  .trim()
  .isLength({ min: 3 })
  .withMessage("login must not be empty")
  .isLength({ max: 10 })
  .withMessage("password must max 10 length")
  .matches("^[a-zA-Z0-9_-]*$")
  .withMessage("login wil be pattern");

export const idValidationUserPassword = body("password")
  .exists()
  .withMessage("password is required")
  .isString()
  .withMessage("password must be a string")
  .trim()
  .isLength({ min: 6 })
  .withMessage("password must be min 6 lenght")
  .isLength({ max: 20 })
  .withMessage("password must max 20 lenght");

export const idValidationCode = body("code")
  .exists()
  .withMessage("code is required")
  .isString()
  .withMessage("code must be a string")
  .trim()
  .isUUID();

export const idValidationRecoveryCode = body("recoveryCode")
  .exists()
  .withMessage("code is required")
  .isString()
  .withMessage("code must be a string")
  .trim()
  .isUUID();
