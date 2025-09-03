import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/const/httpCodes";
import { findUserByIdQueryRepo } from "../../repositories/findUserByIdQueryRepo";

export const getUserHandler = async (req: Request, res: Response) => {
  const id = req.params?.id as string;

  const user = await findUserByIdQueryRepo(id);
  res.status(HttpStatus.Ok).send(user);
};
