import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/const/httpCodes";
import { authService } from "../../service/auth.service";

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
    //refresh_cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 20 * 1000
    });
    //
    res.status(HttpStatus.Ok).send({ accessToken });
    return;
  } catch (e) {
    console.log(e);
    res.status(HttpStatus.Unauthorized).send();
    return;
  }
};
