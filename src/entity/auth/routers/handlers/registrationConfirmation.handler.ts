import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/types/httpCodes";
import { authService } from "../../service/auth.service";

export const registrationConfirmationHandler = async (
  req: Request,
  res: Response
) => {
  const { code } = req.body;

  const user = await authService.registrationConfirmation(code);

  if (!user) {
    res.status(HttpStatus.BadRequest).send();
  }

  res.status(HttpStatus.NoContent).send();
};
