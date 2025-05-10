import {ValidationError, validationResult} from 'express-validator';
import {NextFunction, Request, Response} from 'express';
import {HttpStatus} from "../../types/httpCodes";

const formatErrors = (error: ValidationError) => ({
  field: error.param,  // Поле с ошибкой
  message: error.msg,  // Сообщение ошибки
});

export const inputValidationResultMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req).formatWith(formatErrors).array();

  if (errors.length) {
    return res.status(HttpStatus.BadRequest).json({errorMessages: errors});
  }

  next(); // Если ошибок нет, передаём управление дальше
};