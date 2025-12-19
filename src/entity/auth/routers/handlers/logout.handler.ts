import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/const/httpCodes";
import { securityCollection, tokenCollection } from "../../../../db/mongo.db";
import { jwtService } from "../../../../core/utils/jwtUtils";

export const logoutHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;

    if (oldRefreshToken) {
      await tokenCollection.insertOne({ token: oldRefreshToken });
    }
    const { userId, deviceId } = jwtService.decode(oldRefreshToken);
    const session = await securityCollection.findOne({
      deviceId: deviceId,
      id: userId
    });

    if (!session) {
      res.status(HttpStatus.Unauthorized).send();
    }

    await securityCollection.deleteOne({
      deviceId: deviceId,
      id: userId
    });

    res.status(HttpStatus.NoContent).send();
    return;
  } catch (e) {
    res.status(HttpStatus.Unauthorized).send();
    return;
  }
};
