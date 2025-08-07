import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/types/httpCodes";
import { authService } from "../../service/auth.service";

export const registrationHandler = async (req: Request, res: Response) => {
  try {
    const { login, email, password } = req.body;

    const user = await authService.registerUser(login, password, email);

    if (!user) {
      res.status(HttpStatus.BadRequest).send();
    }

    res.status(HttpStatus.NoContent).send();
  } catch (e) {
    const err = e as Error;
    if (err.message === "wrongLogin") {
      res.status(HttpStatus.BadRequest).json({
        errorsMessages: [{ message: "login should be unique", field: "login" }]
      });
      return;
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
      return;
    }
  }
};
