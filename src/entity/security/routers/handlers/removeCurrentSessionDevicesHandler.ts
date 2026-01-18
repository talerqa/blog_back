import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/const/httpCodes";
import { errorsName } from "../../../../core/const/errorsName";
import { sessionsService } from "../../compositionRoot";
import { TokenModel } from "../../../auth/domain/dto/token.entity";

export const removeCurrentSessionDevicesHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, tokenDecoded } = req?.headers as {
      userId: string;
      tokenDecoded: string;
    };
    const deviceId = req?.params?.deviceId as string;

    const session = await sessionsService.removeCurrentSessionDevice(
      userId,
      deviceId
    );
    if (!session) {
      res.status(HttpStatus.Forbidden).send();
    }

    const token = await new TokenModel({ token: tokenDecoded });
    await token.save();

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
