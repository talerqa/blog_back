import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/types/httpCodes";
import jwt from "jsonwebtoken";
import { findUserQueryRepo } from "../../../user/repositories/findUserQueryRepo";

export const authGuard = async (req: Request, res: Response, next) => {
  try {
    const auth = req.headers["authorization"];
    if (!auth) {
      res.status(HttpStatus.Unauthorized).send();
    }
    const token = auth?.split(" ")[1];

    const isVerify = await jwt.verify(token, process.env.SECRET_KEY);

    if (!isVerify) {
      res.status(HttpStatus.Unauthorized).send();
    }
    const { userId } = isVerify;

    const user = await findUserQueryRepo(userId);

    res.status(HttpStatus.Ok).send({
      email: user?.email,
      login: user?.login,
      userId: userId
    });
    next();
  } catch (e) {
    console.log(e);
    res.status(HttpStatus.Unauthorized).send();
    return;
  }
};
