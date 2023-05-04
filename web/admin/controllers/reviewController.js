import errors from "../utils/errors.js";
import Review from "../models/reviewModel.js";
// const BrandInfo = require("../../models/brandInfoModel");
import mongoose from "mongoose";

//@Router router.route("/userproduct").post(createProduct);
//user wise product display
export const penddingReview = async (req, res, next) => {
  try {
    console.log("reqqqq", req.query);
    const is_published = req.query.is_published;
    const is_review_done = req.query.is_review_done;
    const itemperpage = req.query.itemperpage || 100;
    const currentpageno = req.query.currentpageno || 1;

    let andQuery = [];

    if (is_published) {
      andQuery.push({ is_published });
    }
    if (is_review_done) {
      andQuery.push({ is_review_done });
    }

    let arrData;
    if (andQuery.length > 0) {
      arrData = {
        $and: andQuery,
      };
    } else {
      arrData = {};
    }

    let review = await Review.find(arrData)
      .populate({
        path: "review_by",
        select: "first_name last_name profile_image type_of_user",
      })
      .populate({
        path: "review_to",
        select: "first_name last_name profile_image type_of_user",
      })
      .limit(itemperpage)
      .skip(itemperpage * currentpageno - itemperpage)
      .sort({ createdAt: -1 })
      .lean();
    review = JSON.parse(JSON.stringify(review));
    console.log("review,review", review);

    review = review.filter((e) => {
      return e.review_by != null;
    });

    // for (const e of review) {

    //     if(e?.review_by?.type_of_user === "brand"){
    //       let brand= await BrandInfo.findOne({user_id:e?.review_by?._id}).select("business_name store_website").lean()
    //       e.review_by.brand_name = brand?.business_name || brand?.store_website
    //    }

    //    if(e?.review_to?.type_of_user === "brand"){
    //     let brand= await BrandInfo.findOne({user_id:e?.review_to?._id}).select("business_name store_website").lean()
    //     e.review_to.brand_name = brand?.business_name || brand?.store_website
    //   }
    //     if(e?.review_by?.profile_image){
    //       e.review_by.profile_image = process.env.AWS_S3_BASE_URL + e?.review_by?.profile_image
    //     }
    //     if(e?.review_to?.profile_image){
    //       e.review_to.profile_image = process.env.AWS_S3_BASE_URL + e?.review_to?.profile_image
    //     }
    // }

    res.status(200).json({
      success: true,
      review,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

// //@Router router.route("/newproduct").get(getAllstatus);
// // product create
// exports.createReview = async (req, res, next) => {
//   try {
//     const {review_to,review_comment,review_rating,post_as_user} = req.body;
//     const validUser= await Review.findOne({$and:[{review_to:review_to},{review_by:req.user.id}]})
//     if(validUser){
//         return res.status(400).json({
//             success: true,
//             message:"Already Give a Review this user"
//           });
//     }

//    const matchreview = await Review.findOne({$and:[{review_to:req.user.id},{review_by:review_to},{is_published:false}]})
//    let review
//     if(matchreview){
//        review = await Review.create({
//         review_by:req.user.id,
//         review_to,
//         review_comment,
//         review_rating,
//         post_as_user,
//         is_published:true,
//         is_review_done:true,
//         publish_date: Date.now(),
//       });
//       const review_from = await Review.findOneAndUpdate({$and:[{review_to:req.user.id},{review_by:review_to},{is_published:false}]},{is_review_done:true , is_published:true,complited_pair:review._id},{new:true})
//     }else{
//         review = await Review.create({
//         review_by:req.user.id,
//         review_to,
//         review_comment,
//         review_rating,
//         post_as_user
//         })
//     }

//       return res.status(201).json({
//        success: true,
//        message: review && "Create successfully Review."
//       });
//   } catch (error) {
//     console.log("error",error)
//     return (res.status(500).json(errors.SERVER_ERROR))
//   }
// };

// //@Router router.route("/userreviewbyid").get(getAllstatus);
// // user review by id
// exports.userReviewById = async (req, res, next) => {
//     try {
//       const {review_to} = req.body;

//       let review= await Review.findOne({$and:[{review_to:review_to},{review_by:req.user.id}]}).populate({path:"review_by" ,select:'first_name last_name profile_image type_of_user'}).populate({path:"review_to" ,select:'first_name last_name profile_image type_of_user'})
//       review=JSON.parse(JSON.stringify(review))

//         if(review?.review_by?.type_of_user === "brand"){
//           let brand= await BrandInfo.findOne({user_id:review?.review_by?._id}).select("business_name store_website").lean()
//           review.review_by.brand_name = brand?.business_name || brand?.store_website
//         }

//          if(review?.review_to?.type_of_user === "brand"){
//           let brand= await BrandInfo.findOne({user_id:review?.review_to?._id}).select("business_name store_website").lean()
//           review.review_to.brand_name = brand?.business_name || brand?.store_website
//         }

//           if(review?.review_by?.profile_image){
//             review.review_by.profile_image = process.env.AWS_S3_BASE_URL + review?.review_by?.profile_image
//           }
//           if(review?.review_to?.profile_image){
//             review.review_to.profile_image = process.env.AWS_S3_BASE_URL + review?.review_to?.profile_image
//           }

//     return res.status(200).json({
//         success: true,
//         review:review
//     });
//     } catch (error) {
//       console.log("error",error)
//       return (res.status(500).json(errors.SERVER_ERROR))
//     }
//   };

//   //@Router router.route("/newproduct").get(getAllstatus);
// // product create  //all review button
// exports.reviewByUserId = async (req, res, next) => {
//     try {
//       const {review_to} = req.body;
//       const itemperpage = req.query.itemperpage || 100;
//       const currentpageno = req.query.currentpageno || 1;
//       let review= await Review.find({$and:[{review_to:review_to,is_review_done:true}]}).populate({path:"review_to" ,select:'first_name last_name profile_image type_of_user'}).populate({path:"review_by" ,select:'first_name last_name profile_image type_of_user'}).limit(itemperpage).skip((itemperpage*currentpageno)-itemperpage).sort({createdAt:-1}).lean()

//       review = JSON.parse(JSON.stringify(review));

//       for (let e of review) {

//         if(e.review_to == null){
//           e.review_to = {}
//           e.review_to.first_name="Flagged"
//           e.review_to.last_name="User"
//           e.review_to.type_of_user="customer"
//           e.review_to.brand_name="Flagged User"
//       }

//       if(e.review_by == null)
//       {
//         e.review_by= {}
//         e.review_by.first_name="Flagged"
//         e.review_by.last_name="User"
//         e.review_by.type_of_user="customer"
//         e.review_by.brand_name="Flagged User"
//       }

//         if(e?.review_by?.type_of_user === "brand"){
//             let brand= await BrandInfo.findOne({user_id:e?.review_by?._id}).select("business_name store_website").lean()
//             e.review_by.brand_name = brand?.business_name || brand?.store_website
//         }

//         if(e?.review_to?.type_of_user === "brand"){
//           let brand= await BrandInfo.findOne({user_id:e?.review_to?._id}).select("business_name store_website").lean()
//           e.review_to.brand_name = brand?.business_name || brand?.store_website
//         }

//         if(e?.review_to?.profile_image){
//           e.review_to.profile_image = process.env.AWS_S3_BASE_URL + e?.review_to?.profile_image
//         }

//         if(e?.review_by?.profile_image){
//           e.review_by.profile_image = process.env.AWS_S3_BASE_URL + e?.review_by?.profile_image
//         }

//       }
//     return res.status(200).json({
//         success: true,
//         review
//     });
//     } catch (error) {
//       console.log("error",error)
//       return (res.status(500).json(errors.SERVER_ERROR))
//     }
//   };

export const complitedReview = async (req, res, next) => {
  try {
    const itemperpage = req.query.itemperpage || 100;
    const currentpageno = req.query.currentpageno || 1;
    console.log("current", currentpageno);

    let matchreview = [];
    matchreview = await Review.find({
      $or: [
        {
          $and: [{ is_review_done: true, complited_pair: { $ne: undefined } }],
        },
        {
          $and: [{ is_review_done: true, complited_pair: { $ne: undefined } }],
        },
      ],
    })
      //  matchreview= await Review.find({$and:[{review_by:req.user.id,is_review_done:true,complited_pair:{$ne:undefined}}]})
      .select({
        review_comment: 1,
        review_rating: 1,
        post_as_user: 1,
        createdAt: 1,
        _id: 1,
      })
      .populate({
        path: "complited_pair",
        model: "review",
        select: {
          publish_date: 0,
          updatedAt: 0,
          is_published: 0,
          is_review_done: 0,
          __v: 0,
        },
        // sort: { "createdAt": -1 },
        populate: {
          path: "review_to review_by",
          model: "User",
          select: {
            first_name: 1,
            last_name: 1,
            profile_image: 1,
            type_of_user: 1,
          },
        },
      })
      .sort({ updatedAt: -1 })
      .limit(itemperpage)
      .skip(itemperpage * currentpageno - itemperpage)
      .lean();
    //  .populate({path:"review_to" ,select:'first_name last_name profile_image type_of_user'}).populate({path:"review_by" ,select:'first_name last_name profile_image type_of_user'})

    matchreview = JSON.parse(JSON.stringify(matchreview));

    console.log("matchreview", matchreview);

    for (let e of matchreview) {
      if (e.complited_pair.review_to == null) {
        e.complited_pair.review_to = {};
        e.complited_pair.review_to.first_name = "Flagged";
        e.complited_pair.review_to.last_name = "User";
        e.complited_pair.review_to.type_of_user = "customer";
        e.complited_pair.review_to.brand_name = "Flagged User";
      }

      if (e.complited_pair.review_by == null) {
        e.complited_pair.review_by = {};
        e.complited_pair.review_by.first_name = "Flagged";
        e.complited_pair.review_by.last_name = "User";
        e.complited_pair.review_by.type_of_user = "customer";
        e.complited_pair.review_by.brand_name = "Flagged User";
      }
      e.complited_pair.review_by._id = e?.complited_pair?._id;
      e.complited_pair.review_by.review_rating =
        e?.complited_pair?.review_rating;
      e.complited_pair.review_by.review_comment =
        e?.complited_pair?.review_comment;
      e.complited_pair.review_by.post_as_user = e?.complited_pair?.post_as_user;
      e.complited_pair.review_by.createdAt = e?.complited_pair?.createdAt;

      // if (e?.complited_pair?.review_by?.type_of_user === "brand") {
      //   let brand = await BrandInfo.findOne({
      //     user_id: e?.complited_pair?.review_by?._id,
      //   })
      //     .select("business_name ")
      //     .lean();
      //   e.complited_pair.review_by.brand_name = brand?.business_name;
      // }
      e.complited_pair.review_to._id = e?._id;
      e.complited_pair.review_to.review_rating = e?.review_rating;
      e.complited_pair.review_to.review_comment = e?.review_comment;
      e.complited_pair.review_to.post_as_user = e?.post_as_user;
      e.complited_pair.review_to.createdAt = e?.createdAt;

      // if (e?.complited_pair?.review_to?.type_of_user === "brand") {
      //   let brand = await BrandInfo.findOne({
      //     user_id: e?.complited_pair?.review_to?._id,
      //   })
      //     .select("business_name ")
      //     .lean();
      //   e.complited_pair.review_to.brand_name = brand?.business_name;
      // }
      if (e?.complited_pair?.review_to?.profile_image) {
        e.complited_pair.review_to.profile_image =
          process.env.AWS_S3_BASE_URL +
          e?.complited_pair?.review_to?.profile_image;
      }

      if (e?.complited_pair?.review_by?.profile_image) {
        e.complited_pair.review_by.profile_image =
          process.env.AWS_S3_BASE_URL +
          e?.complited_pair?.review_by?.profile_image;
      }

      delete e?.review_rating;
      delete e?.review_comment;
      delete e?.post_as_user;
      delete e?.createdAt;
      delete e?._id;

      delete e?.complited_pair?.review_rating;
      delete e?.complited_pair?.review_comment;
      delete e?.complited_pair?.createdAt;
      delete e?.complited_pair?.post_as_user;
      // delete e?.complited_pair?._id;
    }
    return res.status(200).json({
      success: true,
      review: matchreview,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    let { review_by, review_to } = req.query;
    // console.log("review_id11", review_id);
    // review_id=JSON.parser(review_id)
    // review_id=JSON.parse(review_id)
    console.log("review_id222", review_by, review_to);
    // const review = await Review.deleteMany({_id:{$in:review_id}});
    let review;
    if (review_by) {
      review = await Review.deleteMany({ _id: review_by });
    }
    if (review_to) {
      await Review.deleteMany({ _id: review_to });
    }
    res.status(200).json({
      success: true,
      review,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

//@Router router.route("/userreviewbyid").get(getAllstatus);
// user review by id
export const userReviewById = async (req, res, next) => {
  try {
    const { review_to, review_by } = req.body;
    console.log("pairr", review_to, review_by);
    let review = await Review.findOne({
      $and: [{ review_to: review_by }, { review_by: review_to },{is_review_done:true}],
    })
      .populate({
        path: "review_by",
        select: "first_name last_name profile_image type_of_user",
      })
      .populate({
        path: "review_to",
        select: "first_name last_name profile_image type_of_user",
      });
    review = JSON.parse(JSON.stringify(review));
    console.log("rrreview,",review)

    if (review?.review_by?.profile_image) {
      review.review_by.profile_image =
        process.env.CDN_BASE_URL + review?.review_by?.profile_image;
    }
    if (review?.review_to?.profile_image) {
      review.review_to.profile_image =
        process.env.CDN_BASE_URL + review?.review_to?.profile_image;
    }

    return res.status(200).json({
      success: true,
      review: review,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};
