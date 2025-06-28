import { body } from "express-validator";

export const idValidationUserEmail = body("email")
  .exists()
  .withMessage("email is required")
  .isString()
  .withMessage("email must be a string")
  .trim()
  .isLength({ min: 1 })
  .isEmail();

export const idValidationUserLogin = body("login")
  .exists()
  .withMessage("login is required")
  .isString()
  .withMessage("login must be a string")
  .trim()
  .isLength({ min: 1 })
  .withMessage("login must not be empty");

export const idValidationUserPassword = body("password")
  .exists()
  .withMessage("password is required")
  .isString()
  .withMessage("password must be a string")
  .trim()
  .isLength({ min: 1 })
  .withMessage("password must not be empty");
