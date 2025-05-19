import { ValidationError, validationResult } from "express-validator";
import { HttpStatus } from "../../types/httpCodes";

const formatErrors = (error: ValidationError & { path: string }) => ({
  field: error?.path,
  message: error.msg
});

export const inputValidationResultMiddleware = (req, res, next) => {
  const errors = validationResult(req)
    .formatWith(formatErrors)
    .array();
  const filtered = Object.values(
    errors.reduce((acc, err) => {
      if (!acc[err.field]) {
        acc[err.field] = err; // Сохраняем только первую ошибку на поле
      }
      return acc;
    }, {} as Record<string, typeof errors[0]>)
  );

  if (filtered.length) {
    return res.status(HttpStatus.BadRequest).json({ errorsMessages: filtered });
  }

  next();
};
