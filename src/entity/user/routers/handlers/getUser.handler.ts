import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/types/httpCodes";
import { findUserQueryRepo } from "../../repositories/findUserQueryRepo";

export const getUserHandler = async (req: Request, res: Response) => {
  const id = req.params?.id as string;

  const user = await findUserQueryRepo(id);
  res.status(HttpStatus.Ok).send(user);
};
