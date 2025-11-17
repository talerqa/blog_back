import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/const/httpCodes";
import { sessionsService } from "../../application/sessions.service";
import { errorsName } from "../../../../core/const/errorsName";
import { tokenCollection } from "../../../../db/mongo.db";

export const removeCurrentSessionDevicesHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, tokenDecoded } = req?.headers as string;
    const deviceId = req?.params?.deviceId as string;

    const session = await sessionsService.removeCurrentSessionDevice(
      userId,
      deviceId
    );
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
