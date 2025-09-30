import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/const/httpCodes";
import { authService } from "../../service/auth.service";
import { config } from "../../../../core/const/config";

export const loginHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { loginOrEmail, password } = req.body;

    const { accessToken, refreshToken } = await authService.login(
      loginOrEmail,
      password
    );

    res.cookie("refreshToken", refreshToken, config.refreshTokenOptions);
    res.status(HttpStatus.Ok).send({ accessToken });
    return;
  } catch (e) {
    res.status(HttpStatus.Unauthorized).send();
    return;
  }
};
