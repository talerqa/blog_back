import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/types/httpCodes";
import { authService } from "../../service/auth.service";

export const registrationConfirmationHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { code } = req.body;

    const user = await authService.registrationConfirmation(code);

    if (!user) {
      res.status(HttpStatus.BadRequest).send();
    }

    res.status(HttpStatus.NoContent).send();
  } catch (e) {
    const err = e as Error;
    console.log(err);
    if (err.message === "codeAlredyAprove") {
      res.status(HttpStatus.BadRequest).json({
        errorsMessages: [
          {
            message: "code alredy aprove",
            field: "code"
          }
        ]
      });
    }

    if (err.message === "codeError") {
      res.status(HttpStatus.BadRequest).json({
        errorsMessages: [
          {
            message: "code should be unique",
            field: "code"
          }
        ]
      });
    }
    if (err.message === "expiredDate") {
      res.status(HttpStatus.BadRequest).json({
        errorsMessages: [
          {
            message: "code should be expired ",
            field: "code"
          }
        ]
      });
    }
  }
};
