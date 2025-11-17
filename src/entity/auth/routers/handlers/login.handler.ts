import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/const/httpCodes";
import { authService } from "../../service/auth.service";
import { config } from "../../../../core/const/config";

export const loginHandler = async (req: Request, res: Response) => {
  try {
    const { loginOrEmail, password } = req.body;
    const title = req.headers["user-agent"] ?? ("untitled" as string);
    let ip = req.ip as string;
    if (ip === "::1") {
      ip = "127.0.0.1";
    }

    const body: { title: string; ip: string } = {
      title,
      ip
    };

    const { accessToken, refreshToken } = await authService.login(
      loginOrEmail,
      password,
      body
    );

    res.cookie("refreshToken", refreshToken, config.refreshTokenOptions);
    res.status(HttpStatus.Ok).send({ accessToken });

    return;
  } catch (e) {
    res.status(HttpStatus.Unauthorized).send();
    return;
  }
};
