import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/types/httpCodes";
import { authService } from "../../service/auth.service";

export const loginHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { loginOrEmail, password } = req.body;

    const user = await authService.login(loginOrEmail, password);

    if (!user) {
      res.status(HttpStatus.Unauthorized).send();
      return;
    }

    res.status(HttpStatus.Ok).send({ accessToken: user });
    return;
  } catch (e) {
    console.log(e);
  }
};
