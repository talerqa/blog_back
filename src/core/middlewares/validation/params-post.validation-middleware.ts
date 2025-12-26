import { body, param } from "express-validator";

export const idValidationParamId = param("id")
  .exists()
  .withMessage("ID is required")
  .isString()
  .withMessage("ID must be a string")
  .trim()
  .isLength({ min: 1 })
  .withMessage("ID must not be empty")
  .isMongoId()
  .withMessage("blogId must be a mongoDb id");

export const idValidationPostId = param("postId")
  .exists()
  .withMessage("postId is required")
  .isString()
  .withMessage("postId must be a string")
  .trim()
  .isLength({ min: 1 })
  .withMessage("postId must not be empty")
  .isMongoId()
  .withMessage("postId must be a mongoDb id");

export const idValidationCommentId = param("commentId")
  .exists()
  .withMessage("commentId is required")
  .isString()
  .withMessage("commentId must be a string")
  .trim()
  .isLength({ min: 1 })
  .withMessage("commentId must not be empty")
  .isMongoId()
  .withMessage("commentId must be a mongoDb id");

export const idValidationBLogIdPost = body("blogId")
  .exists()
  .withMessage("blogId is required")
  .isString()
  .withMessage("blogId must be a string")
  .trim()
  .isLength({ min: 1 })
  .withMessage("blogId must not be empty")
  .isMongoId()
  .withMessage("blogId must be a mongoDb id");

export const idValidationTitlePost = body("title")
  .exists()
  .withMessage("title is required")
  .isString()
  .withMessage("title must be a string")
  .trim()
  .isLength({ min: 1, max: 30 })
  .withMessage("title must not be empty");

export const idValidationShortDescriptionPost = body("shortDescription")
  .exists()
  .withMessage("shortDescription is required")
  .isString()
  .withMessage("shortDescription must be a string")
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage("shortDescription must not be empty");

export const idValidationContentPost = body("content")
  .exists()
  .withMessage("content is required")
  .isString()
  .withMessage("content must be a string")
  .trim()
  .isLength({ min: 1, max: 1000 })
  .withMessage("content must not be empty");

export const idValidationContentComment = body("content")
  .exists()
  .withMessage("content is required")
  .isString()
  .withMessage("content must be a string")
  .trim()
  .isLength({ min: 20, max: 300 })
  .withMessage("content must not be empty");

export const idValidationLikeComment = body("likeStatus")
  .exists()
  .withMessage("likeStatus is required")
  .isString()
  .withMessage("likeStatus must be a string")
  .trim()
  .withMessage("content must not be empty")
  .isIn(["None", "Like", "Dislike"])
  .withMessage('likeStatus must be one of "None", "Like", "Dislike"');
