import express from "express";
import { isAuthentication } from "../middleware/auth.js";

const router = express.Router();
import {
  getAllTag,
  createTag,
  verifyTag,
  getTagUesrs,
  deleteTag,
  deleteadminTag,
  searchtag,
} from "../controllers/tagController.js";

//create tag
router.route("/newtag").post( createTag);

//get all tag
router.route("/alltags").get(getAllTag);

//verify tag admin
router.route("/verifytag").put( verifyTag);

//user wise get tag
router.route("/userwisetag").get(isAuthentication, getTagUesrs);

// delete all tag particuler user.
router.route("/deletetag").delete(isAuthentication, deleteTag);

//delete a particuler tag  admin
router.route("/deleteadmintag/:tagId").delete(deleteadminTag);

//search tag
router.route("/searchtag").get(searchtag);

export default router;
