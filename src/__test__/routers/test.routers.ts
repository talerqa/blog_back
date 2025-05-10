import {Router} from 'express';
import {HttpStatus} from "../../core/types/httpCodes";
import {db} from "../../core/db/db";

export const testingRouter = Router({});

testingRouter.delete('/all-data', (req, res) => {

  res.status(HttpStatus.NoContent).send(db.blogs = []);
});
