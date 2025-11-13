import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/const/httpCodes";
import { sessionsService } from "../../application/sessions.service";
import { errorsName } from "../../../../core/const/errorsName";
import { tokenCollection } from "../../../../db/mongo.db";
import { jwtService } from "../../../../core/utils/jwtUtils";

export const removeCurrentSessionDevicesHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, expDate, title, ip, tokenDecoded } = req?.headers as string;
    const deviceId = req?.params?.deviceId as string;

    const body: {
      userId: string;
      expDate: string;
      deviceId: string;
      title: string;
      ip: string;
    } = { userId, expDate, deviceId, title, ip };

    const session = await sessionsService.removeCurrentSessionDevice(body);
    if (!session) {
      res.status(HttpStatus.Forbidden).send();
    }

    await tokenCollection.insertOne({ token: tokenDecoded });

    res.status(HttpStatus.NoContent).send();
  } catch (e) {
    const err = e as Error;

    if (err.message === errorsName.not_found_deviceId) {
      res.status(HttpStatus.NotFound).send();
      return;
    }

    return;
  }
};
