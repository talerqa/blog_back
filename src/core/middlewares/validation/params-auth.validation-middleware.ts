import { body } from "express-validator";

export const idValidationLoginOrEmail = body("loginOrEmail")
  .exists()
  .withMessage("loginOrEmail is required")
  .isString()
  .withMessage("loginOrEmail must be a string")
  .trim()
  .isLength({ min: 1 })
  .withMessage("loginOrEmail must not be empty");

export const idValidationPassword = body("password")
  .exists()
  .withMessage("password is required")
  .isString()
  .withMessage("password must be a string")
  .trim()
  .isLength({ min: 1 })
  .withMessage("password must not be empty");
