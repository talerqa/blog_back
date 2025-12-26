import { StringValue } from "ms";

export const config = {
  refreshTokenOptions: {
    httpOnly: true,
    secure: true,
    maxAge: 20 * 1000
  },
  expiredAccessToken: "100000000000" as StringValue,
  expiredRefreshToken: "2000000000" as StringValue,
  rateLimit: 5
};
