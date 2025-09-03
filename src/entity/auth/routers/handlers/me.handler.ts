import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/const/httpCodes";
import { findUserByIdQueryRepo } from "../../../user/repositories/findUserByIdQueryRepo";

export const meHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req?.headers?.userId as string;
    const user = await findUserByIdQueryRepo(userId);

    res.status(HttpStatus.Ok).send({
      email: user?.email,
      login: user?.login,
      userId
    });

    return;
  } catch (e) {
    console.log(e);
    res.status(HttpStatus.Unauthorized).send();
    return;
  }
};
