import {Router} from 'express';
import {HttpStatus} from "../../core/types/httpCodes";

export const testingRouter = Router({});

testingRouter.delete('/all-data', (req, res) => {
  res.status(HttpStatus.NoContent).send({blogs: []});
});
