import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/const/httpCodes";
import { authService } from "../../compositionRoot";
import { errorMap, errorsName } from "../../../../core/const/errorsName";

export const newPassRecoveryHandler = async (req: Request, res: Response) => {
  try {
    const { recoveryCode, newPassword } = req.body;
    await authService.newPassRecovery(recoveryCode, newPassword);
    res.status(HttpStatus.NoContent).send();
    return;
  } catch (e) {
    const err = e as Error;

    if (err.message === errorsName.confirm_code) {
      res.status(HttpStatus.BadRequest).send();
      return;
    }

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
