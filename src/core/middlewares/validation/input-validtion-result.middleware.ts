import {ValidationError, validationResult} from 'express-validator';
import {HttpStatus} from "../../types/httpCodes";

const formatErrors = (error: ValidationError | any) => ({
  field: error?.path,  // Поле с ошибкой
  message: error.msg,  // Сообщение ошибки
});

export const inputValidationResultMiddleware = (
  req: any,
  res: any,
  next: any
) => {
  const errors = validationResult(req).formatWith(formatErrors).array()
  const filtered = Object.values(
    errors.reduce((acc, err) => {
      if (!acc[err.field]) {
        acc[err.field] = err; // Сохраняем только первую ошибку на поле
      }
      return acc;
    }, {} as Record<string, typeof errors[0]>)
  );

  if (filtered.length) {
    return res.status(HttpStatus.BadRequest).json({errorsMessages: filtered});
  }

  next(); // Если ошибок нет, передаём управление дальше
};