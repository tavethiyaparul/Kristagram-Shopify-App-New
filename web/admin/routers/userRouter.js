import express from "express";
import { isAuthentication } from "../middleware/auth.js";
// import { isAuthenticationUser } from "../middleware/userAuth.js";
// import { logOut } from "../controllers/adminController.js";
const router = express.Router();

import {
  // registerUser,
  // saveCost,
  VerifyUser,
  login,
  getuserDetails,
  // typeOfUser,s
  deleteUser,
  // logout,
  userAdmin,
  logOut,
  // getuser,
  // deleteadminUser,
  brandInfo,
  // typeOfBrand,
  // adminUpdateUserDetails,
  // admingetuser,
  // searchconnectuser,
  // connectuser,
  // getconnectuser,
  admingetuserDetails,
  locationUser,
  getuserFollowers,
  getuserFollowing,
 
  // profileimage,
  // coverimage,
  // adminProfileCoverimage
} from "../controllers/userController.js";

import { adminTokenCheck, getUserDetails } from "../controllers/adminController.js";

router.route("/admindetails").get(isAuthentication, getUserDetails);

router.route("/checktoken").post(adminTokenCheck);

// phone no Login api
router.route("/phoneauth").post(login);

// Type of user Influance and brater
// router.route("/typeofuser").post(isAuthentication,typeOfUser);

//register user facebook and instagram
// router.route("/register").put(isAuthentication,registerUser);

//verify user panding approved and reject
router.route("/verifyuser").put(isAuthentication, VerifyUser);

//admin user create.
router.route("/adminuser").put(userAdmin);

// save cost userwise and if user status= approved then after 15 day update a cost,tag
// router.route("/savecost").post(isAuthentication,saveCost);

//typeofbrand offline and online
// router.route("/typeofbrand").post(isAuthentication,typeOfBrand);

// save brand inforamation
// router.route("/savebrand").post(isAuthenticationUser,brandInfo);

//all User Details
// router.route("/allusers").get(getuserDetails);

//all user Details admin
router.route("/all").get(admingetuserDetails);

//get login user details
// router.route("/me").get(getuser);

// get followers
router.route("/getfollowers").get(getuserFollowers);

// get following
router.route("/getfollowing").get(getuserFollowing);

//delete User
router.route("/deleteme/:id").delete(isAuthentication, deleteUser);

//admin logout
router.route("/logout").get(isAuthentication,logOut);

//admin logout
router.route("/location").put(isAuthentication, locationUser);

//admin delete user
// router.route("/deleteadminuser").delete(isAuthentication,deleteadminUser);

//logout user
// router.route("/logout").put(isAuthentication,logout);

//admin edit user details
// router.route("/edituser").put(isAuthentication,adminUpdateUserDetails);

//admin get user details
// router.route("/admingetuser").post(isAuthentication,admingetuser);

//search username
// router.route("/search").get(isAuthentication,searchconnectuser);

//connect user follower and follwing
// router.route("/connect").post(isAuthentication,connectuser);

// profile image upload
// router.route("/image").post(isAuthentication,profileimage);

// profile image upload
// router.route("/coverimage").post(isAuthentication,coverimage);

// profile image upload
// router.route("/adminimage").put(isAuthentication,adminProfileCoverimage);

// profile image upload

export default router;
