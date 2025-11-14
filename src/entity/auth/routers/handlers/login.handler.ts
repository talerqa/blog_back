import { Request, Response } from "express";
import { HttpStatus } from "../../../../core/const/httpCodes";
import { authService } from "../../service/auth.service";
import { config } from "../../../../core/const/config";
import { rateLimitCollection } from "../../../../db/mongo.db";
import { RateLimit } from "../../../rateLimit/types/rateLimit";

export const loginHandler = async (req: Request, res: Response) => {
  try {
    const { loginOrEmail, password } = req.body;
    const title = req.headers["user-agent"] ?? ("untitled" as string);
    let ip = req.ip as string;
    if (ip === "::1") {
      ip = "127.0.0.1";
    }

    let baseUrl = req.baseUrl as string;
    let originalUrl = req.originalUrl as string;

    const body: { title: string; ip: string } = {
      title,
      ip
    };

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

    const { accessToken, refreshToken } = await authService.login(
      loginOrEmail,
      password,
      body
    );

    res.cookie("refreshToken", refreshToken, config.refreshTokenOptions);
    res.status(HttpStatus.Ok).send({ accessToken });

    return;
  } catch (e) {
    res.status(HttpStatus.Unauthorized).send();
    return;
  }
};
