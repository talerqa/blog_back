import { HttpStatus } from "../const/httpCodes";
import { rateLimitCollection } from "../../db/mongo.db";
import { RateLimit } from "../../entity/rateLimit/types/rateLimit";

export const isAuthGuardMiddleware = (req: any, res: any, next: any) => {
  const auth = req.headers["authorization"] as string; // 'Basic xxxx'

  if (auth !== "Basic YWRtaW46cXdlcnR5") {
    return res.sendStatus(HttpStatus.Unauthorized);
  }

  next();
};

export const isRateLimit = async (req: any, res: any, next: any) => {
  let ip = req?.ip as string;
  let baseUrl = req?.baseUrl as string;
  let originalUrl = req?.originalUrl as string;

  if (ip === "::1") {
    ip = "127.0.0.1";
  }
  const now = new Date();
  const date = now.toISOString();
  const tenSecondsAgo = new Date(now.getTime() - 10 * 1000).toISOString();

  const filter = {
    ip,
    "url.baseUrl": baseUrl,
    "url.originalUrl": originalUrl,
    date: { $gte: tenSecondsAgo }
  };

  const count = await rateLimitCollection.countDocuments(filter);

  if (count >= 5) {
    return res.status(429).send();
  }
  const rateLimit = {
    ip,
    url: {
      baseUrl,
      originalUrl
    },
    date
  };
  await rateLimitCollection.insertOne({
    ...rateLimit
  } as RateLimit);

  next();
};
