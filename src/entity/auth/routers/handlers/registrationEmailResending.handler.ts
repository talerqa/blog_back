import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/types/httpCodes";
import { authService } from "../../service/auth.service";

export const registrationEmailResendingHandler = async (
  req: Request,
  res: Response
) => {
  const { email } = req.body;

  const user = await authService.resending(email);

  if (!user) {
    res.status(HttpStatus.BadRequest).json({
      errorsMessages: [{ message: "losdfsd fds sdf sd", field: "email" }]
    });
  }

  res.status(HttpStatus.NoContent).send();
};
