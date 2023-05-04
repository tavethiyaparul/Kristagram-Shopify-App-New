import express from "express";
import { createSpam, deleteSpam, getSpam, updateSpam } from "../controllers/fraudContentController.js";
const router = express.Router();

//create spam
router.route("/newspam").post( createSpam);

//get spam
router.route("/getspam").get( getSpam);

// update spam
router.route("/updatespam").put( updateSpam);

// delete spam
router.route("/deletespam/:id").delete( deleteSpam);

export default router;