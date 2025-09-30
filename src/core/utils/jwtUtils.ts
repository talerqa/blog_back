import jwt, {JwtPayload, PrivateKey, PublicKey, Secret} from "jsonwebtoken";
import type {StringValue} from "ms";

export interface MyJwtPayload extends JwtPayload {
  userId: string;
}

export const jwtService = {
  sing: (id: string, timeExpired: StringValue | number) => {
    return jwt.sign(
      {
        userId: id
      },
      process.env.SECRET_KEY as Secret | PrivateKey,
      {expiresIn: timeExpired}
    )
  },
  verify: (cookies: string) => {
    return jwt.verify(cookies, process.env.SECRET_KEY as Secret | PublicKey) as MyJwtPayload
  },
  decode: (cookies: string) => {
    return jwt.decode(cookies) as MyJwtPayload
  }
};
