import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/types/httpCodes";
import { findUserQueryRepo } from "../../../user/repositories/findUserQueryRepo";

export const meHandler = async (req: Request, res: Response) => {
  const userId = req?.headers.userId as string;

  const user = await findUserQueryRepo(userId);

  if (!user) {
    res.status(HttpStatus.Unauthorized).send();
  }

  res.status(HttpStatus.Ok).send({
    email: user?.email,
    login: user?.login,
    userId: userId
  });
};
