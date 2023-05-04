import express from "express";
import {
  createCategory,
  deleteCategory,
  deleteWishList,
  getWishList,
  getWishListCategory,
  getWishListCount,
  updateCategory,
} from "../controllers/wishListController.js";
import { isAuthentication } from "../middleware/auth.js";
const router = express.Router();

// get wish category
router.route("/getcategory").get(getWishListCategory);

// get wish category
router.route("/createcategory").post(createCategory);

// update category
router.route("/updatecategory").put(updateCategory);

// delete category
router.route("/deletecategory/:id").delete(deleteCategory);

// get wishlist
router.route("/getwishlist").get(getWishList);

// delete wishlist   
router.route("/deletewishlist/:id").delete(isAuthentication,deleteWishList);

// get user count
router.route("/wishlistbyuser").get(getWishListCount);

export default router;
