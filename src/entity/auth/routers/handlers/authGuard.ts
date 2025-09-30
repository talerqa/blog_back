import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../../../core/const/httpCodes";
import { findUserByIdQueryRepo } from "../../../user/repositories/findUserByIdQueryRepo";
import { tokenCollection } from "../../../../db/mongo.db";
import { jwtService } from "../../../../core/utils/jwtUtils";

const unauthorized = (res: Response) => {
  res.status(HttpStatus.Unauthorized).send();
};

export const authGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const auth = req.headers["authorization"];
    if (!auth) {
      return unauthorized(res);
    }

    const [authType, token] = auth.split(" ");

    if (authType !== "Bearer" || !token) {
      return unauthorized(res);
    }

    let verifyToken;
    try {
      verifyToken = jwtService.verify(token);
    } catch (err) {
      return unauthorized(res);
    }
    const { userId } = verifyToken;
    await findUserByIdQueryRepo(userId);

    req.headers = { ...req.headers, userId, tokenDecoded: verifyToken };
    next();
  } catch (e) {
    const err = e as Error;
    return unauthorized(res);
  }
};

export const cookieGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const cookies = req.cookies.refreshToken;

    if (!cookies) {
      return unauthorized(res);
    }

    let decodedToken;
    try {
      decodedToken = jwtService.decode(cookies);
      jwtService.verify(cookies);
    } catch (err) {
      return unauthorized(res);
    }

    const { userId, exp } = decodedToken;

    await findUserByIdQueryRepo(userId);
    const now = Math.floor(Date.now() / 1000);

    if (exp && now >= exp) {
      await tokenCollection.insertOne({ token: cookies });
      return unauthorized(res);
    }

    const exists = await tokenCollection.findOne({ token: cookies });

    if (exists) {
      return unauthorized(res);
    }

    req.headers = { ...req.headers, userId, tokenDecoded: decodedToken };
    next();
  } catch (e) {
    const err = e as Error;
    return unauthorized(res);
  }
};
