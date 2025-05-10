import {HttpStatus} from "../types/httpCodes";

export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'qwerty';

export const isAuthGuardMiddleware = (req, res, next) => {
  const auth = req.headers['Authorization'] as string; // 'Basic xxxx'
  if (!auth) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  const [authType, token] = auth.split(' '); //admin:qwerty
  if (authType !== 'Basic') {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  const credentials = Buffer.from(token, 'base64').toString('utf-8');
  const [username, password] = credentials.split(':');

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  next(); // Успешная авторизация, продолжаем
};