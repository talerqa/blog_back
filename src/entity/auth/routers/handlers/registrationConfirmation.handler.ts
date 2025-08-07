import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/types/httpCodes";
import { authService } from "../../service/auth.service";

export const registrationConfirmationHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { code } = req.body;

    await authService.registrationConfirmation(code);

    res.status(HttpStatus.NoContent).send();
  } catch (e) {
    const err = e as Error;

    if (err.message === "codeError") {
      res.status(HttpStatus.BadRequest).json({
        errorsMessages: [
          {
            message: "code error",
            field: "code"
          }
        ]
      });
    }
  }
};
