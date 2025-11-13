import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/const/httpCodes";
import { sessionsService } from "../../application/sessions.service";
import { tokenCollection } from "../../../../db/mongo.db";

export const removeOtherSessionDevicesHandler = async (
  req: Request,
  res: Response
) => {
  const {
    userId,
    expDate,
    deviceId,
    title,
    ip,
    tokenDecoded
  } = req?.headers as string;
  const body: {
    userId: string;
    expDate: string;
    deviceId: string;
    title: string;
    ip: string;
  } = { userId, expDate, deviceId, title, ip };

  const sessionDevices = await sessionsService.removeOtherSessionDevice(body);
  await tokenCollection.insertOne({ token: tokenDecoded });
  if (!sessionDevices) {
    res.status(HttpStatus.Unauthorized).send();
  }

  res.status(HttpStatus.NoContent).send();
};
