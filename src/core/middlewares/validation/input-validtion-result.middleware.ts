import { ValidationError, validationResult } from "express-validator";
import { HttpStatus } from "../../types/httpCodes";
import { NextFunction, Request, Response } from "express";

const formatErrors = (error: ValidationError | any) => ({
  field: error?.path,
  message: error.msg
});

export const inputValidationResultMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
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
    res.status(HttpStatus.BadRequest).json({ errorsMessages: filtered });
    return;
  }

  next();
};
