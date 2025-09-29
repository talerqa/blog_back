import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../../../core/const/httpCodes";
import { findUserByIdQueryRepo } from "../../../user/repositories/findUserByIdQueryRepo";
import jwt, { PublicKey, Secret } from "jsonwebtoken";
import { tokenCollection } from "../../../../db/mongo.db";

export const authGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const auth = req.headers["authorization"];
    if (!auth) {
      res.status(HttpStatus.Unauthorized).send();
      return;
    }

    const [authType, token] = auth.split(" ");

    if (authType !== "Bearer" || !token) {
      res.status(HttpStatus.Unauthorized).send();
      return;
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(
        token,
        process.env.SECRET_KEY as Secret | PublicKey
      );
    } catch (err) {
      res.status(HttpStatus.Unauthorized).send();
      return;
    }
    console.log(1);
    const { userId }: any = decodedToken;
    const tokenDecoded = decodedToken;
    await findUserByIdQueryRepo(userId);

    req.headers = { ...req.headers, userId, tokenDecoded };
    next();
  } catch (e) {
    const err = e as Error;

    res.status(HttpStatus.Unauthorized).send();
    return;
  }
};

export const authCookieGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const auth = req.headers["authorization"];
    const cookies = req.cookies.refreshToken;

    if (!cookies) {
      res.status(HttpStatus.Unauthorized).send();
      return;
    }

    let tokenDecoded;
    try {
      tokenDecoded = jwt.decode(cookies);
    } catch (err) {
      res.status(HttpStatus.Unauthorized).send();
      return;
    }

    try {
      jwt.verify(cookies, process.env.SECRET_KEY as Secret | PublicKey);
    } catch (err) {
      res.status(HttpStatus.Unauthorized).send();
      return;
    }

    const { userId, exp }: any = tokenDecoded;

    await findUserByIdQueryRepo(userId);
    const now = Math.floor(Date.now() / 1000);

    if (now >= exp) {
      await tokenCollection.insertOne({ token: cookies });
      res.status(HttpStatus.Unauthorized).send();
      return;
    }

    const exists = await tokenCollection.findOne({ token: cookies });
    if (exists) {
      res.status(HttpStatus.Unauthorized).send();
      return;
    }

    req.headers = { ...req.headers, userId, tokenDecoded };
    next();
  } catch (e) {
    const err = e as Error;

    res.status(HttpStatus.Unauthorized).send();
    return;
  }
};
