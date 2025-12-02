import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/const/httpCodes";
import { errorMap } from "../../../../core/const/errorsName";
import { authService } from "../../compositionRoot";

export const registrationHandler = async (req: Request, res: Response) => {
  try {
    const { login, email, password } = req.body;
    await authService.registerUser(login, password, email);
    res.status(HttpStatus.NoContent).send();
    return;
  } catch (e) {
    const err = e as Error;
    const errorResponse = errorMap[err.message];
    if (errorResponse) {
      res.status(HttpStatus.BadRequest).json({
        errorsMessages: [errorResponse]
      });
      return;
    }

    return;
  }
};
