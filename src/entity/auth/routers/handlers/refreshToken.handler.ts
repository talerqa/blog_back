import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/const/httpCodes";
import { authService } from "../../service/auth.service";
import { errorMap } from "../../../../core/const/errorsName";
import { tokenCollection } from "../../../../db/mongo.db";

export const refreshTokenHandler = async (req: Request, res: Response) => {
  try {
    const userId = req?.headers?.userId as string;
    const { refreshToken, accessToken } = await authService.refreshToken(
      userId
    );

    const oldRefreshToken = req.cookies.refreshToken; // Получаем старый токен

    // Добавляем старый токен в черный список
    if (oldRefreshToken) {
      await tokenCollection.insertOne({ token: oldRefreshToken });
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

    return;
  }
};
