import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/const/httpCodes";
import { tokenCollection } from "../../../../db/mongo.db";
import { sessionsService } from "../../compositionRoot";

export const removeOtherSessionDevicesHandler = async (
  req: Request,
  res: Response
) => {
  const { userId, deviceId, tokenDecoded } = req?.headers as string;

  const sessionDevices = await sessionsService.removeOtherSessionDevice(
    userId,
    deviceId
  );
  await tokenCollection.insertOne({ token: tokenDecoded });
  if (!sessionDevices) {
    res.status(HttpStatus.Unauthorized).send();
  }

  res.status(HttpStatus.NoContent).send();
};
