// @ts-ignore
import request from "supertest";
import { TESTING_PATH } from "../../core/paths/paths";
import { HttpStatus } from "../../core/const/httpCodes";
import { Express } from "express";

export async function clearDb(app: Express) {
  // @ts-ignore
  await request(app)
    .delete(`${TESTING_PATH}/all-data`)
    .expect(HttpStatus.NoContent);
  return;
}
