import express from "express";
const router = express.Router();
import {isAuthentication} from "../middleware/auth.js";

import {
    createCampaign,
    getcampaignProduct
} from "../controllers/campaignController.js";

// get user wise product 
router.route("/userwisecampaign").get(getcampaignProduct);

// // create product 
router.route("/newcampaign").post(isAuthentication,createCampaign);


export default router;