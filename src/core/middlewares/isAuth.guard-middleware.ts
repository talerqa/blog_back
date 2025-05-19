import { HttpStatus } from "../types/httpCodes";

export const isAuthGuardMiddleware = (req: any, res: any, next: any) => {
  const auth = req.headers["authorization"] as string; // 'Basic xxxx'

  if (auth !== "Basic YWRtaW46cXdlcnR5") {
    return res.sendStatus(HttpStatus.Unauthorized);
  }

  next();
};
