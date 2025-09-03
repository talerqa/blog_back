import { Request, Response } from "express";
import { userService } from "../../application/user.service";
import { HttpStatus } from "../../../../core/const/httpCodes";
import { errorsName } from "../../../../core/const/errorsName";

export const createUserHandler = async (req: Request, res: Response) => {
  try {
    const user = await userService.createUser(req.body);

    if (!user) {
      res.status(HttpStatus.BadRequest).send(user);
    }

    res.status(HttpStatus.Created).send(user);
  } catch (e) {
    const err = e as Error;
    if (err.message === errorsName.wrong_login) {
      res.status(HttpStatus.BadRequest).json({
        errorsMessages: [{ message: "login should be unique", field: "login" }]
      });
    }
    if (err.message === errorsName.wrong_email) {
      res.status(HttpStatus.BadRequest).json({
        errorsMessages: [
          {
            message: "email should be unique",
            field: "email"
          }
        ]
      });
    }
  }
};
