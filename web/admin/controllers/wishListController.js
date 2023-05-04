import Wishlistcategories from "../models/wishListCategoryModel.js";
import mongoose from "mongoose";
import errors from "../utils/errors.js";
import Wishlist from "../models/wishListModel.js";
import Product from "../models/productModel.js";
import Countries from "../models/countryModel.js";
import User from "../models/userModel.js";
// get wish
export const getWishListCategory = async (req, res, next) => {
  try {
    const wish = await Wishlistcategories.find({})
      .sort({ createdAt: -1 })
      .lean();
    return res.status(200).json({
      success: true,
      wishlist: wish,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

// get wish
export const createCategory = async (req, res, next) => {
  try {
    const { status, content } = req.body;
    const wish = await Wishlistcategories.create({ content, status });
    return res.status(200).json({
      success: true,
      wishlist: wish,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

// update Category
export const updateCategory = async (req, res, next) => {
  try {
    const { id, status, content } = req.body;
    console.log("req.body", req.body);
    const spam = await Wishlistcategories.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(id) },
      {
        $set: {
          content,
          status,
        },
      },
      {
        new: true,
      }
    );
    console.log("spam", spam);
    res.status(200).json({
      success: true,
      spam,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

// delete Category
export const deleteCategory = async (req, res, next) => {
  try {
    console.log("req.user.id", req.params);
    const spamId = mongoose.Types.ObjectId(req.params);
    const spam = await Wishlistcategories.findByIdAndDelete({ _id: spamId });
    console.log("spam", spam);
    res.status(201).json({
      success: true,
      message: "Delete successfully",
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

//@Router router.route("/wish").get(getWishList);
// get wishlist
export const getWishList = async (req, res, next) => {
  try {
    const itemperpage = req.query.itemperpage || 100;
    const currentpageno = req.query.currentpageno || 1;

    // await Product.find();

    let wish = await Wishlist.find()
      .populate({ path: "product", select: "product_image price name " })
      .populate({
        path: "user_id",
        select:
          "first_name last_name country state  city  pin_code profile_image type_of_user",
      })
      .populate({ path: "wish_list_category", select: { content: 1, _id: 0 } })
      .limit(itemperpage)
      .skip(itemperpage * currentpageno - itemperpage)
      .sort({ createdAt: -1 })
      .lean();

    wish = JSON.parse(JSON.stringify(wish));

    wish = wish.filter((e) => {
      return e.user_id != null;
    });
    for (const e of wish) {
      e.wish_list_category = e?.wish_list_category?.content;
      if (typeof e?.product?.product_image === "string") {
        e.product.product_image = [
          process.env.CDN_BASE_URL + e?.product?.product_image,
        ];
      } else {
        e.product.product_image = e?.product?.product_image?.map(
          (it) => process.env.CDN_BASE_URL + it
        );
      }
      if (e.user_id.profile_image) {
        e.user_id.profile_image =
          process.env.CDN_BASE_URL + e?.user_id?.profile_image;
      }
      if (e?.user_id?.country) {
        let data = await Countries.findOne({
          Country_Name: e?.user_id?.country,
        }).select("Country_Flag");
        data = JSON.parse(JSON.stringify(data));
        if (data) {
          e.user_id.country_flag =
            process.env.CDN_BASE_URL + data?.Country_Flag;
        }
      }

      e.user = e.user_id;
      delete e.user_id;
    }
    return res.status(200).json({
      success: true,
      wishlist: wish,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

//@Router router.route("/deletewishlist/:id").delete(deleteWishList);
// delete wishlist
export const deleteWishList = async (req, res, next) => {
  console.log("req.user.flag", req.user.flag);
  try {
    if (req.user.flag === "true") {
      console.log(
        "wishlist",
        req.params.id,
        "req.user.wish_list_count",
        req.user.wish_list_count
      );

      //wishlist delete
      let wishlist = await Wishlist.deleteMany({ _id: req.params.id });

      wishlist = JSON.parse(JSON.stringify(wishlist));

      console.log(
        "delete wishlist ",
        wishlist,
        "00000",
        req.user.wish_list_count
      );

      // remove wishlist count
      await User.findByIdAndUpdate(
        { _id: mongoose.Types.ObjectId(req.user.id) },
        {
          $set: {
            wish_list_count:
              Number(
                req.user.wish_list_count === undefined
                  ? 0
                  : req.user.wish_list_count
              ) - wishlist.deletedCount,
          },
        },
        {
          new: true,
        }
      );

      return res.status(200).json({
        success: true,
        message:
          wishlist?.deletedCount > 0
            ? "Wishlist Delete Successfully"
            : "Wishlist Not Deleted. ",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Invalid User",
      });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

// view details wishlist
export const getWishListCount = async (req, res, next) => {
  try {
    let wish = await Wishlist.find({ user_id: req.query.user_id })
      .populate({ path: "product", select: "product_image price name user_id" })
      .populate({
        path: "user_id",
        select: "first_name last_name country state  city  pin_code type_of_user",
      })
      .populate({ path: "wish_list_category", select: { content: 1, _id: 0 } })
      .sort({ createdAt: -1 })
      .lean();
    // console.log("wisj",wish)
    if (wish.length <= 0) {
      return res.status(200).json({
        success: true,
        wishlist: [],
      });
    }

    wish = JSON.parse(JSON.stringify(wish));

    wish =
      wish.length &&
      wish.filter((e) => {
        return e.user_id != null;
      });

    wish.length &&
      wish?.map((e) => {
        // e.wish_list_category = e?.wish_list_category?.content
        if (e?.wish_list_category != null) {
          e.wish_list_category = e?.wish_list_category?.content;
        }

        if (typeof e?.product?.product_image === "string") {
          e.product.product_image = [
            process.env.CDN_BASE_URL + e?.product?.product_image,
          ];
        } else {
          e.product.product_image = e?.product?.product_image?.map(
            (it) => process.env.CDN_BASE_URL + it
          );
        }

        e.user = e.user_id;
        delete e.user_id;
      });
    return res.status(200).json({
      success: true,
      wishlist: wish,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};
