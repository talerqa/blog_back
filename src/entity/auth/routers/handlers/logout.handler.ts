import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/const/httpCodes";
import { tokenCollection } from "../../../../db/mongo.db";

export const logoutHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;

    if (oldRefreshToken) {
      await tokenCollection.insertOne({ token: oldRefreshToken });
    }

    res.status(HttpStatus.NoContent).send();
    return;
  } catch (e) {
    res.status(HttpStatus.Unauthorized).send();
    return;
  }
};
