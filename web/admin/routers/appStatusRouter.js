import {
  getAppStatus,
  createAppStatus,
  updateAppStatus,
} from "../controllers/appStatusController.js";
import express from "express";
import { isAuthentication } from "../middleware/auth.js";

const router = express.Router();

router.route("/getappstatus").get(getAppStatus);

router.route("/createappstatus").post(isAuthentication,createAppStatus);

router.route("/updateappstatus").put(updateAppStatus);


export default router;
