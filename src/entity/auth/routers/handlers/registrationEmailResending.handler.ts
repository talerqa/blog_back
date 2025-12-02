import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/const/httpCodes";
import { errorMap } from "../../../../core/const/errorsName";
import { authService } from "../../compositionRoot";

export const registrationEmailResendingHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const dto = req.body;
    await authService.resending(dto.email);
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
