import express from "express";
import { notifyMsg } from "../controllers/notificationController.js";
const router = express.Router();

//notification
router.route("/notification").post( notifyMsg);


export default router;