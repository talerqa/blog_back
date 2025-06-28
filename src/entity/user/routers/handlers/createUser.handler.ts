import { Request, Response } from "express";
import { userService } from "../../application/user.service";
import { HttpStatus } from "../../../../core/types/httpCodes";

export const createUserHandler = async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);

  if (!user || user.errorsMessages) {
    res.status(HttpStatus.BadRequest).send(user);
  }

  res.status(HttpStatus.Created).send(user);
};
