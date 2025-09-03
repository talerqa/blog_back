import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/const/httpCodes";
import { authService } from "../../service/auth.service";

export const loginHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { loginOrEmail, password } = req.body;

    const accessToken = await authService.login(loginOrEmail, password);

    res.status(HttpStatus.Ok).send({ accessToken });
    return;
  } catch (e) {
    console.log(e);
    res.status(HttpStatus.Unauthorized).send();
    return;
  }
};
