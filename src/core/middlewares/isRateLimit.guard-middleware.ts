import { RateLimit } from "../../entity/rateLimit/types/rateLimit";
import { config } from "../const/config";
import { HttpStatus } from "../const/httpCodes";
import { RateLimitModel } from "../../entity/rateLimit/domain/dto/rateLimit.entity";

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

  const count = await RateLimitModel.countDocuments(filter).exec();

  if (count >= config.rateLimit) {
    return res.status(HttpStatus.TooManyRequest).send();
  }
  const rateLimit = {
    ip,
    url: {
      baseUrl,
      originalUrl
    },
    date
  };
  const rateLimitEntity = await new RateLimitModel({
    ...rateLimit
  } as RateLimit);
  await rateLimitEntity.save();
  next();
};
