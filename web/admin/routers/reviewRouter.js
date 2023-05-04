import express from "express";
import { complitedReview, deleteReview, penddingReview, userReviewById } from "../controllers/reviewController.js";
const router = express.Router();

// get user wise product 
router.route("/reviewpending").get(penddingReview);

// // create product 
// router.route("/createreview").post(isAuthentication,createReview);

// // review done  
// router.route("/userreviewbyid").post(isAuthentication,userReviewById);

// // review done  
// router.route("/reviewbyuser").post(reviewByUserId);

// // review done 
router.route("/reviewcomplited").get(complitedReview);

// delete 
router.route("/reviewdelete").delete(deleteReview);

// review pair by id
router.route("/reviewpair").post(userReviewById);


export default router;
