import {body, param} from "express-validator";

export const idValidationParamId = param("id")
  .exists()
  .withMessage("ID is required")
  .isString()
  .withMessage("ID must be a string")
  .trim()
  .isLength({min: 1})
  .withMessage("ID must not be empty")
  .isMongoId()
  .withMessage("blogId must be a mongoDb id");


export const idValidationNameBlog = body("name")
  .exists()
  .withMessage("Name is required")
  .isString()
  .withMessage("Name must be a string")
  .trim()
  .isLength({min: 1, max: 15})
  .withMessage("Name must not be empty");

export const idValidationDescriptionBlog = body("description")
  .exists()
  .withMessage("Description is required")
  .isString()
  .withMessage("Description must be a string")
  .trim()
  .isLength({min: 1, max: 500})
  .withMessage("Description must not be empty");

export const idValidationWebsiteUrlBlog = body("websiteUrl")
  .exists()
  .withMessage("WebsiteUrl is required")
  .isString()
  .withMessage("WebsiteUrl must be a string")
  .trim()
  .isLength({min: 1, max: 100})
  .withMessage("WebsiteUrl must not be empty")
  .isURL()
  .withMessage("WebsiteUrl must be pattern");
  