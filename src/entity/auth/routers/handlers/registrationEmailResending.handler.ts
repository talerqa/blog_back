import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/types/httpCodes";
import { authService } from "../../service/auth.service";

export const registrationEmailResendingHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { email } = req.body;

    const user = await authService.resending(email);

    if (!user) {
      res.status(HttpStatus.BadRequest).send();
      return;
    }

    return res.status(HttpStatus.NoContent).send();
  } catch (e) {
    const err = e as Error;

    if (err.message === "wrongEmail") {
      res.status(HttpStatus.BadRequest).json({
        errorsMessages: [
          {
            message: "error",
            field: "email"
          }
        ]
      });
    }
  }
};
