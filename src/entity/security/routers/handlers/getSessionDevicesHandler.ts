import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/const/httpCodes";
import { sessionsService } from "../../compositionRoot";

export const getSessionDevicesHandler = async (req: Request, res: Response) => {
  const { userId } = req?.headers as { userId: string };

  const sessionDevices = await sessionsService.getCurrentSessionDevice(userId);
  res.status(HttpStatus.Ok).send(sessionDevices);
};
