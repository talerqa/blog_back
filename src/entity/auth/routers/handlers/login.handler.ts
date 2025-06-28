import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/types/httpCodes";
import { authService } from "../../application/auth.service";

export const loginHandler = async (req: Request, res: Response) => {
  const { loginOrEmail, password } = req.body;

  const user = await authService.login(loginOrEmail, password);

  if (!user) {
    res.status(HttpStatus.Unauthorized).send();
  }

  res.status(HttpStatus.NoContent).send();
};
