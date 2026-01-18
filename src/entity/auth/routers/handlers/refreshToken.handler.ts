import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/const/httpCodes";
import { errorMap, errorsName } from "../../../../core/const/errorsName";
import { authService } from "../../compositionRoot";
import { TokenModel } from "../../domain/dto/token.entity";

export const refreshTokenHandler = async (req: Request, res: Response) => {
  try {
    const userId = req?.headers?.userId as string;
    const expDate = req?.headers?.expDate as string;
    const deviceId = req?.headers?.deviceId as string;
    const title = req?.headers?.title as string;
    let ip = req.ip as string;
    if (ip === "::1") {
      ip = "127.0.0.1";
    }
    const body = {
      expDate,
      deviceId,
      title,
      ip
    };

    const { refreshToken, accessToken } = await authService.refreshToken(
      userId,
      body
    );

    const oldRefreshToken = req.cookies.refreshToken; // Получаем старый токен

    // Добавляем старый токен в черный список
    if (oldRefreshToken) {
      const token = await new TokenModel.insertOne({ token: oldRefreshToken });
      await token.save();
    }

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 20 * 1000
    });
    //
    res.status(HttpStatus.Ok).send({ accessToken });

    return;
  } catch (e) {
    const err = e as Error;
    const errorResponse = errorMap[err.message];

    if (errorResponse) {
      res.status(HttpStatus.BadRequest).json({
        errorsMessages: [errorResponse]
      });
      return;
    }
    if (err.message === errorsName.not_found_session) {
      res.status(HttpStatus.Unauthorized).send();
      return;
    }

    return;
  }
};
