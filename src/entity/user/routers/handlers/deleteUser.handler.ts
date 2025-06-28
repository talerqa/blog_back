import { Request, Response } from "express";
import { userService } from "../../application/user.service";
import { HttpStatus } from "../../../../core/types/httpCodes";

export const deleteUserHandler = async (req: Request, res: Response) => {
  const id = req.params?.id as string;
  const user = await userService.deleteUserById(id);

  if (!user) {
    res.status(HttpStatus.NotFound).send();
  }

  res.status(HttpStatus.NoContent).send();
};
