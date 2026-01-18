import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/const/httpCodes";
import { sessionsService } from "../../compositionRoot";
import { TokenModel } from "../../../auth/domain/dto/token.entity";

export const removeOtherSessionDevicesHandler = async (
  req: Request,
  res: Response
) => {
  const { userId, deviceId, tokenDecoded } = req?.headers as {
    userId: string;
    deviceId: string;
    tokenDecoded: string;
  };

  const sessionDevices = await sessionsService.removeOtherSessionDevice(
    userId,
    deviceId
  );
  const token = await new TokenModel({ token: tokenDecoded });
  await token.save();
  if (!sessionDevices) {
    res.status(HttpStatus.Unauthorized).send();
  }

  res.status(HttpStatus.NoContent).send();
};
