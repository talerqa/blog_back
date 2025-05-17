import {body, param} from "express-validator";

export const idValidationParamId = param("id")
  .exists()
  .withMessage("ID is required")
  .isString()
  .withMessage("ID must be a string")
  .trim()
  .isLength({min: 1})
  .withMessage("ID must not be empty");


export const idValidationBLogIdPost = body("blogId")
  .exists()
  .withMessage("blogId is required")
  .isString()
  .withMessage("blogId must be a string")
  .trim()
  .isLength({min: 1})
  .withMessage("blogId must not be empty");

export const idValidationTitlePost = body("title")
  .exists()
  .withMessage("title is required")
  .isString()
  .withMessage("title must be a string")
  .trim()
  .isLength({min: 1, max: 30})
  .withMessage("title must not be empty");

export const idValidationShortDescriptionPost = body("shortDescription")
  .exists()
  .withMessage("shortDescription is required")
  .isString()
  .withMessage("shortDescription must be a string")
  .trim()
  .isLength({min: 1, max: 100})
  .withMessage("shortDescription must not be empty");

export const idValidationContentPost = body("content").isNumeric()
  .exists()
  .withMessage("content is required")
  .isString()
  .withMessage("content must be a string")
  .trim()
  .isLength({min: 1, max: 1000})
  .withMessage("content must not be empty")

