import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/types/httpCodes";
import { findUserQueryRepo } from "../../../user/repositories/findUserQueryRepo";
import jwt, { Secret } from "jsonwebtoken";

export const authGuard = async (req: Request, res: Response, next: any) => {
  try {
    const auth = req.headers["authorization"];
    if (!auth) {
      res.status(HttpStatus.Unauthorized).send();
    }
    const token = auth?.split(" ")[1];
    const authType = auth?.split(" ")[0];

    if (authType !== "Bearer" || !token) {
      res.status(HttpStatus.Unauthorized).send();
    }

    const isVerify = jwt.verify(
      token as string,
      process.env.SECRET_KEY as Secret
    );
    console.log(isVerify);
    if (!isVerify) {
      res.status(HttpStatus.Unauthorized).send();
    }
    const { userId } = isVerify as any;

    const user = await findUserQueryRepo(userId as string);

    if (!user) {
      res.status(HttpStatus.Unauthorized).send();
    }

    // res.status(HttpStatus.Ok).send({
    //   email: user?.email,
    //   login: user?.login,
    //   userId: userId
    // });

    req.headers = { userId };
    next();
    return;
  } catch (e) {
    console.log(e);
    res.status(HttpStatus.Unauthorized).send();
    return;
  }
};
