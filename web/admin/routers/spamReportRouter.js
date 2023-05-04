import express from "express";
import { createSpam, deleteSpam, getSpam, updateSpam } from "../controllers/fraudContentController.js";
import { getSpamReport, getSpamReportCount, getSpamReportCount2, getSpamReportNew } from "../controllers/spamReportController.js";
const router = express.Router();

//get spam
router.route("/getspamreport").get( getSpamReport);

router.route("/getspamreportcount").get( getSpamReportCount);
router.route("/getspamreportcount2/:id").get( getSpamReportCount2);

router.route("/getspamreportnew").get( getSpamReportNew);

// getSpamReportNew
export default router;