import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/const/httpCodes";
import { jwtService } from "../../../../core/utils/jwtUtils";
import { SecurityModel } from "../../../security/domain/dto/security.entity";
import { TokenModel } from "../../domain/dto/token.entity";

export const logoutHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;

    if (oldRefreshToken) {
      const token = await new TokenModel({ token: oldRefreshToken });
      await token.save();
    }
    const { userId, deviceId } = jwtService.decode(oldRefreshToken);
    const session = await SecurityModel.findOne({
      deviceId: deviceId,
      id: userId
    });

    if (!session) {
      res.status(HttpStatus.Unauthorized).send();
    }

    await SecurityModel.findOneAndDelete({
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
