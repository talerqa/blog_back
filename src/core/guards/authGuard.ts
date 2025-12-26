import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../const/httpCodes";
import { findUserByIdQueryRepo } from "../../entity/user/repositories/findUserByIdQueryRepo";
import { tokenCollection } from "../../db/mongo.db";
import { jwtService } from "../utils/jwtUtils";

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

    let verifyToken: any;
    try {
      verifyToken = jwtService.verify(token);
    } catch (err) {
      return unauthorized(res);
    }
    const { userId, exp, deviceId, title, ip } = verifyToken;
    await findUserByIdQueryRepo(userId);

    req.headers = {
      ...req.headers,
      userId,
      expDate: exp,
      deviceId,
      title,
      ip,
      tokenDecoded: verifyToken
    };
    next();
  } catch (e) {
    const err = e as Error;
    return unauthorized(res);
  }
};

export const cookieGuard = async (
  req: Request & any,
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

    const { userId, exp, deviceId, title, ip } = decodedToken;

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

    req.headers = {
      ...req.headers,
      userId,
      deviceId,
      title,
      ip,
      tokenDecoded: decodedToken,
      expDate: exp
    };
    next();
  } catch (e) {
    const err = e as Error;
    return unauthorized(res);
  }
};

export const isAuthUserGuard = async (
  req: Request & any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const auth = req.headers["authorization"];

    if (!auth) {
      req.headers = {
        ...req.headers,
        userId: null
      };
      next();
      return;
    }

    const [authType, token] = auth.split(" ");

    if (authType !== "Bearer" || !token) {
      req.headers = {
        ...req.headers,
        userId: null
      };
      next();
      return;
    }

    let verifyToken: any;
    try {
      verifyToken = jwtService.verify(token);
    } catch (err) {
      req.headers = {
        ...req.headers,
        userId: null
      };
      next();
      return;
    }
    const { userId, exp, deviceId, title, ip } = verifyToken;
    await findUserByIdQueryRepo(userId);

    req.headers = {
      ...req.headers,
      userId,
      expDate: exp,
      deviceId,
      title,
      ip,
      tokenDecoded: verifyToken
    };
    next();
  } catch (e) {
    const err = e as Error;
    req.headers = {
      ...req.headers,
      userId: null
    };
    next();
    return;
  }
};
