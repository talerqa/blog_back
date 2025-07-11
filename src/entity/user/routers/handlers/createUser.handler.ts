import { Request, Response } from "express";
import { userService } from "../../application/user.service";
import { HttpStatus } from "../../../../core/types/httpCodes";

export const createUserHandler = async (req: Request, res: Response) => {
  try {
    const user = await userService.createUser(req.body);

    if (!user) {
      res.status(HttpStatus.BadRequest).send(user);
    }

    res.status(HttpStatus.Created).send(user);
  } catch (e) {
    const err = e as Error;
    if (err.message === "wrongLogin") {
      res.status(HttpStatus.BadRequest).json({
        errorsMessages: [{ message: "login should be unique", field: "login" }]
      });
    }
    if (err.message === "wrongEmail") {
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
