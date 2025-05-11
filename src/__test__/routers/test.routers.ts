import {Router} from 'express';
import {HttpStatus} from "../../core/types/httpCodes";
import {isAuthGuardMiddleware} from "../../core/middlewares/isAuth.guard-middleware";

export const testingRouter = Router({});


testingRouter.delete('/all-data', isAuthGuardMiddleware, (req, res) => {
  res.status(HttpStatus.NoContent).send([]);
});
