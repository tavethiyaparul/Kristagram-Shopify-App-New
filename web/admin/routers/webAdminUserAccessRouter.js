import express from "express";
import { createWebAdminUserAccess, deleteWebAdminUserAccess, getDepartment, getWebAdminUserAccess, updateUserAccessFromMultiEmail, updateWebAdminUserAccess } from "../controllers/webAdminUserAccessController.js";
const router = express.Router();


//create web admin user
router.route("/createuser").post( createWebAdminUserAccess);

//get web admin user
router.route("/getuser").get( getWebAdminUserAccess);

// update web admin user
router.route("/updateuser").put( updateWebAdminUserAccess);

// delete web admin user
router.route("/deletewebuser/:id").delete( deleteWebAdminUserAccess);

// get department
router.route("/getdepartment").get( getDepartment);

// uppdate access with multi user
router.route("/updateAccess").put( updateUserAccessFromMultiEmail);


export default router;