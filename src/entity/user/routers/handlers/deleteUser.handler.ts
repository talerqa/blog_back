import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/const/httpCodes";
import { userService } from "../../compositionRoot";

export const deleteUserHandler = async (req: Request, res: Response) => {
  const id = req.params?.id as string;
  const user = await userService.deleteUserById(id);

  if (!user) {
    res.status(HttpStatus.NotFound).send();
  }

  res.status(HttpStatus.NoContent).send();
};
