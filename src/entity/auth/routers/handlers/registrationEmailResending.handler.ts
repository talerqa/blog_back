import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/const/httpCodes";
import { authService } from "../../service/auth.service";
import { errorsName } from "../../../../core/const/errorsName";

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

    if (err.message === errorsName.wrong_email) {
      res
        .status(HttpStatus.BadRequest)
        .json({
          errorsMessages: [
            {
              message: "error",
              field: "email"
            }
          ]
        })
        .end();
      return;
    }
  }
};
