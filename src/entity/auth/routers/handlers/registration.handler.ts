import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/const/httpCodes";
import { authService } from "../../service/auth.service";
import { errorMap } from "../../../../core/const/errorsName";
import { rateLimitCollection } from "../../../../db/mongo.db";
import { RateLimit } from "../../../rateLimit/types/rateLimit";

export const registrationHandler = async (req: Request, res: Response) => {
  try {
    const { login, email, password } = req.body;
    let ip = req.ip as string;
    let baseUrl = req.baseUrl as string;
    let originalUrl = req.originalUrl as string;

    if (ip === "::1") {
      ip = "127.0.0.1";
    }

    await authService.registerUser(login, password, email);

    const now = new Date();
    const date = now.toISOString();
    const tenSecondsAgo = new Date(now.getTime() - 10 * 1000).toISOString();

    const rateLimit = {
      ip,
      url: {
        baseUrl,
        originalUrl
      },
      date
    };

    const filter = {
      ip,
      "url.baseUrl": baseUrl,
      "url.originalUrl": originalUrl,
      date: { $gte: tenSecondsAgo }
    };

    const count = await rateLimitCollection.countDocuments(filter);

    if (count >= 5) {
      return res.status(429).json({
        message: "Too many requests. Please try again later."
      });
    }

    await rateLimitCollection.insertOne({
      ...rateLimit
    } as RateLimit);

    res.status(HttpStatus.NoContent).send();
    return;
  } catch (e) {
    const err = e as Error;
    const errorResponse = errorMap[err.message];
    if (errorResponse) {
      res.status(HttpStatus.BadRequest).json({
        errorsMessages: [errorResponse]
      });
      return;
    }

    return;
  }
};
