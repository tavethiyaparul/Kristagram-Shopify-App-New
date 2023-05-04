import express from "express";
const router = express.Router();
import { getAllCountry, updateAllCountry } from "../controllers/countrycontroller.js";

// get all country
router.route("/allcountry").get(getAllCountry);
router.route("/updatecountry").put(updateAllCountry);

export default router;