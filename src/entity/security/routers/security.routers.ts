import { Router } from "express";
import { getSessionDevicesHandler } from "./handlers/getSessionDevicesHandler";
import { cookieGuard } from "../../../core/guards/authGuard";
import { removeOtherSessionDevicesHandler } from "./handlers/removeOtherSessionDevicesHandler";
import { removeCurrentSessionDevicesHandler } from "./handlers/removeCurrentSessionDevicesHandler";

export const sessionsRouter = Router({});

sessionsRouter.get("/devices", cookieGuard, getSessionDevicesHandler);

sessionsRouter.delete(
  "/devices",
  cookieGuard,
  removeOtherSessionDevicesHandler
);

sessionsRouter.delete(
  "/devices/:deviceId",
  cookieGuard,
  removeCurrentSessionDevicesHandler
);
