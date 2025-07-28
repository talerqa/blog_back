import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/types/httpCodes";
import { authService } from "../../service/auth.service";

export const registrationHandler = async (req: Request, res: Response) => {
  const { login, email, password } = req.body;

  const user = await authService.registerUser(login, password, email);

  if (!user) {
    res.status(HttpStatus.BadRequest).send();
  }

  res.status(HttpStatus.NoContent).send();
};
