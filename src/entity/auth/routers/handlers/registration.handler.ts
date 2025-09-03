import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/const/httpCodes";
import { authService } from "../../service/auth.service";
import { errorMap } from "../../../../core/const/errorsName";

export const registrationHandler = async (req: Request, res: Response) => {
  try {
    const { login, email, password } = req.body;
    await authService.registerUser(login, password, email);

    res.status(HttpStatus.NoContent).send();
    return;
  } catch (err) {
    const errorResponse = errorMap[err.message];
    if (errorResponse) {
      return res.status(HttpStatus.BadRequest).json({
        errorsMessages: [errorResponse]
      });
    }

    // необработанные ошибки
    return res.sendStatus(HttpStatus.InternalServerError);
  }
};
