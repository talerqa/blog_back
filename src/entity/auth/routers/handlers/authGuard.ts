import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../../../core/const/httpCodes";
import { findUserByIdQueryRepo } from "../../../user/repositories/findUserByIdQueryRepo";
import jwt, { PublicKey, Secret } from "jsonwebtoken";

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

    const { userId }: any = decodedToken;
    await findUserByIdQueryRepo(userId);

    req.headers = { ...req.headers, userId };
    next();
  } catch (e) {
    const err = e as Error;
    console.log(err);
    res.status(HttpStatus.Unauthorized).send();
    return;
  }
};
