import {param} from 'express-validator';

export const idValidationParamId = param('id')
  .exists().withMessage('ID is required')
  .isString().withMessage('ID must be a string')
  .trim()
  .isLength({ min: 1 }).withMessage('ID must not be empty')

export const idValidationNameBlog = param('name')
  .exists().withMessage('Name is required')
  .isString().withMessage('Name must be a string')
  .trim()
  .isLength({min: 1, max: 15}).withMessage('Name must not be empty')

export const idValidationDescriptionBlog = param('description')
  .exists().withMessage('Description is required')
  .isString().withMessage('Description must be a string')
  .trim()
  .isLength({min: 1, max: 500}).withMessage('Description must not be empty')

export const idValidationWebsiteUrlBlog = param('websiteUrl')
  .exists().withMessage('WebsiteUrl is required')
  .isString().withMessage('WebsiteUrl must be a string')
  .trim()
  .isLength({min: 1, max: 500}).withMessage('WebsiteUrl must not be empty')
  .matches('^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$\n')