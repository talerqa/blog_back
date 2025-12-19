import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/const/httpCodes";
import { authService } from "../../compositionRoot";
import { errorMap } from "../../../../core/const/errorsName";

export const passRecoveryHandler = async (req: Request, res: Response) => {
  try {
    const dto = req.body;
    await authService.passRecovery(dto.email);
    res.status(HttpStatus.NoContent).send();
    return;
  } catch (e) {
    const err = e as Error;
    const errorResponse = errorMap[err.message];
    //
    // if (err.message === "wrong_code_or_pass") {
    //   res.status(HttpStatus.BadRequest).json();
    //   return;
    // }

    if (errorResponse) {
      res.status(HttpStatus.BadRequest).json({
        errorsMessages: [errorResponse]
      });
      return;
    }
    return;
  }
};
