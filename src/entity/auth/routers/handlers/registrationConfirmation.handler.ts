import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/const/httpCodes";
import { authService } from "../../service/auth.service";
import { errorsName } from "../../../../core/const/errorsName";

export const registrationConfirmationHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const code = req?.body.code;
    await authService.registrationConfirmation(code);
    res.status(HttpStatus.NoContent).send();
    return;
  } catch (e) {
    const err = e as Error;

    if (err.message === errorsName.not_found_user) {
      res.status(HttpStatus.BadRequest).send();
      return;
    }

    if (err.message === errorsName.confirm_code) {
      res
        .status(HttpStatus.BadRequest)
        .json({
          errorsMessages: [
            {
              message: "code error",
              field: "code"
            }
          ]
        })
        .end();
      return;
    }
  }
};
