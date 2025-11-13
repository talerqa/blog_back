import { StringValue } from "ms";

export const config = {
  refreshTokenOptions: {
    httpOnly: true,
    secure: true,
    maxAge: 20 * 1000
  },
  // expiredAccessToken: "10000" as StringValue,
  // expiredRefreshToken: "20000" as StringValue
  expiredAccessToken: "100000000" as StringValue,
  expiredRefreshToken: "2000000000" as StringValue
};
