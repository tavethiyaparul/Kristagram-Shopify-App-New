import mongoose from "mongoose";
import Cost from "../models/costModel.js";
import AdminUser from "../models/adminUserModel.js";
import adminUser from "../models/userModel.js";

import errors from "../utils/errors.js";
import BrandInfo from "../models/brandInfoModel.js";
import User from "../models/userModel.js";
// import uploadFile from "../utils/common.js";

import aws from "aws-sdk";
import Tag from "../models/tagModel.js";
import Campaign from "../models/companingModel.js";
import brandinfo from "../models/brandInfoModel.js";
import Product from "../models/productModel.js";
import wishList from "../models/wishListModel.js";
import SpamReport from "../models/spamReportModel.js";
import Rent from "../models/rentModel.js";
import WebAdminUserAccess from "../models/webAdminUserAccessModel.js";
import axios from "axios";
import Notification from "../models/notificationModel.js";
//const imageThumbnail = require("image-thumbnail");

//@Router  router.route("/phoneauth").post(login);
// phone no Login api
export const login = async (req, res, next) => {
  try {
    // console.log("ghvg", req.body);
    let { phone } = req.body;

    //  let reg = /^\+[1-9]{1}[0-9]{3,14}$/;
    // /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[456789]\d{9}|(\d[ -]?){10}\d$/

    if (!phone) {
      return res.status(400).json(errors.MANDATORY_FIELDS);
    }

    // if (phone.match(reg) == null) {
    //   return res.status(400).json(errors.INVALID_FIELDS);
    // }

    let PhoneNo = await User.findOne({ phone });
    if (PhoneNo) {
      // only admin login
      const token = await PhoneNo.getJWTToken();
      // console.log("token", token);
      // const token = await sendToken(PhoneNo,device);

      // const users = await userDetails({ phone: phone });

      //create token
      return res.status(200).json({
        success: true,
        user: PhoneNo,
      });
    }

    const user = await User.create({ phone });
    // create token
    // const token = await sendToken(user);
    const token = await user.getJWTToken();
    return res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

export const brandInfo = async (req, res, next) => {
  // console.log("req", req.body, req.user.id);
  try {
    // console.log("req.body 1111", req.body);
    // console.log("req", req.user.id);
    // tag string ti json convert
    let tag;
    // console.log("same", req.body.tag);
    if (req.body.tag) {
      tag = JSON.parse(req.body.tag);
    }
    const {
      pin_code,
      type_of_brand,
      business_name,
      country,
      city,
      state,
      address,
      store_website,
      facebook_followers,
      instagram_followers,
      first_name,
      last_name,
      facebook_username,
      instagram_username,
      youtube_username,
      youtube_followers,
    } = req.body;
    const userId = req.user.id;
    let typeofbrand;
    if (type_of_brand) {
      typeofbrand = type_of_brand.toLowerCase();
    }

    // const coun = await getcity(pin_code)

    //image upload profile and cover image
    let filePath, coverPath;
    var datetime = new Date().getTime();
    // console.log("=====111", req.files);
    if (req.files) {
      if (req.files.profile_image) {
        // console.log("=====2222", req.files.profile_image);

        let profile = req.files.profile_image.data;

        // console.log("profile ======?", profile);
        filePath = await uploadFile(
          profile,
          `${req.user.id}/profie_${datetime}`
        );
        // console.log("file", filePath);
      }
      if (req.files.cover_image) {
        let cover = req.files.cover_image.data;
        coverPath = await uploadFile(cover, `${req.user.id}/cover_${datetime}`);
      }
    }

    const brands = await BrandInfo.find({ user_id: req.user.id });
    // console.log("brands", brands);

    //validation
    // if (brands[0].type_of_brand === "offline") {
    //   if (!country || !city || !state || !address || !tag || !business_name) {
    //     return res.status(400).json(errors.MANDATORY_FIELDS);
    //   }
    // } else if (brands[0].type_of_brand === "online") {
    //   if (!store_website) {
    //     return res.status(400).json(errors.MANDATORY_FIELDS);
    //   }
    // }

    //conver to object
    // const user_id = mongoose.Types.ObjectId(req.user.id);

    if (brands[0]) {
      let timeRemaining =
        new Date(brands[0].updatedAt).getTime() + 1296000000 - Date.now();

      if (
        !(!req.user.is_update || parseInt(timeRemaining) <= 0) &&
        req.user.profile_status === "approved"
      ) {
        //15 days not completed after last update
        let timeDay = dhm(timeRemaining);
        return res.status(400).json({
          success: false,
          message: `Please Edit a brand Record after this  ${timeDay} days.`,
          Daytime: timeDay,
        });
      }

      // tagid and name avaliable in tag table
      if (tag) {
        let tagdata;
        for (const i of tag) {
          const tagName = i.name;
          const tagsId = mongoose.Types.ObjectId(i.tagId);
          tagdata = await Tag.findOne({ _id: tagsId, name: tagName });
          if (!tagdata) {
            return res.status(400).json(errors.INVALID_FIELDS);
          }
        }
      }

      //update followers
      if (facebook_followers && req.user.is_facebook) {
        const data = await User.findByIdAndUpdate(
          { _id: userId },
          { $set: { "facebook_info.facebook_followers": facebook_followers } },
          {
            new: true,
          }
        );
      }

      if (instagram_followers && req.user.is_instagram) {
        const data = await User.findByIdAndUpdate(
          { _id: userId },
          {
            $set: { "instagram_info.instagram_followers": instagram_followers },
          },
          {
            new: true,
          }
        );
      }

      //cost update first time
      // country, state, city,
      const brandUpdate = await BrandInfo.findOneAndUpdate(
        { user_id: userId },
        { business_name, address, tag, store_website },
        {
          new: true,
        }
      );

      if (req.user.profile_status === "approved") {
        const updateTime = await User.findOneAndUpdate(
          { _id: req.user.id },
          {
            brand_update_time: new Date(brandUpdate.updatedAt).getTime(),
            is_update: true,
          },
          {
            new: true,
          }
        );
      }

      const updateTime = await User.findOneAndUpdate(
        { _id: req.user.id },
        {
          $set: {
            brand_update_time: new Date(brandUpdate.updatedAt).getTime(),
          },
          pin_code,
          country,
          city,
          state,
          // country:coun[0],
          first_name,
          last_name,
          facebook_username,
          instagram_username,
          youtube_username,
          youtube_followers,
          instagram_followers,
          facebook_followers,
          profile_image: filePath,
          cover_image: coverPath,
          is_completed_profile: true,
        },
        {
          new: true,
        }
      );

      const users = await userDetails({ _id: mongoose.Types.ObjectId(userId) });
      return res.status(200).json({
        success: true,
        user: users[0],
      });
    }
    //update followers
    if (facebook_followers && req.user.is_facebook) {
      const data = await User.findByIdAndUpdate(
        { _id: userId },
        { $set: { "facebook_info.facebook_followers": facebook_followers } },
        {
          new: true,
        }
      );
    }

    if (instagram_followers && req.user.is_instagram) {
      const data = await User.findByIdAndUpdate(
        { _id: userId },
        {
          $set: { "instagram_info.instagram_followers": instagram_followers },
        },
        {
          new: true,
        }
      );
    }

    //cost update first time
    // country, state, city,
    const brandUpdate = await BrandInfo.create({
      user_id: userId,
      type_of_brand: typeofbrand,
      business_name,
      address,
      tag,
      store_website,
    });

    const updateTime = await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          brand_update_time: new Date(brandUpdate.updatedAt).getTime(),
        },
        pin_code,
        country,
        city,
        state,
        // country:coun[0],
        first_name,
        last_name,
        facebook_username,
        instagram_username,
        youtube_username,
        youtube_followers,
        instagram_followers,
        facebook_followers,
        profile_image: filePath,
        cover_image: coverPath,
        is_completed_profile: true,
      },
      {
        new: true,
      }
    );
    const users = await userDetails({ _id: mongoose.Types.ObjectId(userId) });
    return res.status(200).json({
      success: true,
      user: users[0],
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

//@Router router.route("/verifyuser").put(VerifyUser);
//verify user panding approved and reject

const capitalizeFirst = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const VerifyUser = async (req, res, next) => {
  try {
    // console.log("req.body", req.body);
    const { userId, status } = req.body;
    let statusCase = status.toLowerCase();
    let is_update;
    let brand_update_time;

    if (!status || !userId) {
      return res.status(400).json(errors.MANDATORY_FIELDS);
    }

    if (statusCase === "suspended") {
      is_update = true;
    }
    if (statusCase === "approved") {
      is_update = true;
    }
    if (statusCase === "pending") {
      is_update = false;
    }
    if (req.user.flag) {
      const user = await adminUser.findById({ _id: userId });
      if (!user) {
        return res.status(400).json(errors.INVALID_FIELDS);
      }
      const userDate = await adminUser.findByIdAndUpdate(
        userId,
        { profile_status: statusCase, is_update },
        {
          new: true,
          runValidators: true,
        }
      );
      console.log("userData=====", userDate);

      console.log("user _id", userId);
      if (status === "approved") {
        const userNotification = await User.findOne({
          _id: mongoose.Types.ObjectId(userId),
        }).select({ profile_image: 1, type_of_user: 1 });

        console.log("userNotification", userNotification);

        const fcm_token = await Notification.findOne({
         user_id:userId
        });
        console.log("fcm_token==============================", fcm_token.fcm_token);
        if (fcm_token?.fcm_token) {
          let typeOfUser = capitalizeFirst(userNotification?.type_of_user);
          console.log("typeOfUser", typeOfUser);
          await axios
            .post(
              `https://api.kristagram.com/api/1.4.5/notification`,
              {
                fcm_token: fcm_token.fcm_token,
                title: "Profile Approved at Kristagram",
                description: `Congratulations, your ${typeOfUser} profile is activated now at Kristagram. wish you a best luck !`,
                // image: userNotification?.profile_image,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
              }
            )
            .then((res) => {
              console.log("notification res", res.data);
              return res;
            })
            .catch((error) => {
              console.log("notification error", error);
            });
        }
      }

      return res.status(200).json({
        success: true,
        user: userDate,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Admin User Access. ",
      });
    }
    // }
  } catch (error) {
    console.log("error", error);
    if (error instanceof mongoose.Error.ValidationError) {
      for (let field in error.errors) {
        return res.status(500).json({
          success: false,
          message: error.errors[field].message,
        });
      }
    }
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

//@Router router.route("/adminuser").put(userAdmin);
//admin user create.
export const userAdmin = async (req, res, next) => {
  try {
    const { isAdmin, userId } = req.body;

    if (isAdmin == null || !userId) {
      return res.status(400).json(errors.MANDATORY_FIELDS);
    }

    const user = await adminUser.findById({ _id: userId });
    if (!user) {
      return res.status(400).json(errors.INVALID_FIELDS);
    }

    data = await adminUser.findByIdAndUpdate(
      { _id: userId },
      { $set: { is_admin: isAdmin } },
      {
        new: true,
      }
    );
    return res.status(201).json({
      success: true,
      user: data,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

//@Router router.route("/savecost").post(isAuthentication,saveCost);
// save cost userwise and if user status= approved then after 15 day update a cost,tag

//time remaning
function dhm(ms) {
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  const daysms = ms % (24 * 60 * 60 * 1000);
  const hours = Math.floor(daysms / (60 * 60 * 1000));
  const hoursms = ms % (60 * 60 * 1000);
  const minutes = Math.floor(hoursms / (60 * 1000));
  const minutesms = ms % (60 * 1000);
  const sec = Math.floor(minutesms / 1000);
  //  return days + ":" + hours + ":" + minutes + ":" + sec;
  return days.toString();
}

//user response
async function userDetails(userPara = {}, search = null, type = null) {
  // console.log('userPara',userPara)
  const query = [
    {
      $lookup: {
        from: "costs",
        localField: "_id",
        foreignField: "user_id",
        as: "costs",
      },
    },
    {
      $unwind: {
        path: "$costs",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "brandinfos",
        localField: "_id",
        foreignField: "user_id",
        as: "brands",
      },
    },
    {
      $unwind: {
        path: "$brands",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "campaigns",
        localField: "_id",
        foreignField: "user_id",
        as: "campaign",
      },
    },

    {
      $match: userPara,
    },
  ];

  // console.log("query", JSON.stringify(query, null, 2));
  let users = await adminUser.aggregate(query);
  //  await User.populate(users,{path:"following",select: { 'followers': 0,'following':0}})
  //  await User.populate(users,{path:"followers",select: { 'followers': 0,'following':0}})

  //{ "instagram_info.name": "eeee Tass p" },
  // , match: { $or:[{ "instagram_info.name": "rrr" },{"brands.tags[0].name":"wwwww"}]}  { $in :{"brands.tag.name":"eeee"} }
  //$or:[{ "instagram_info.name": "rrr" },

  //search
  let cond;
  if (search && type) {
    cond = {
      $and: [{ type_of_user: type }],
      $or: [
        { "instagram_info.name": search },
        { "facebook_info.name": search },
        { phone: "+" + search },
      ],
    };
  } else if (type) {
    cond = { $and: [{ type_of_user: type }] };
  } else if (search) {
    cond = {
      $or: [
        { "instagram_info.name": search },
        { "facebook_info.name": search },
        { phone: "+" + search },
      ],
    };
  } else {
    cond = {};
  }

  let data = await adminUser.populate(users, {
    path: "following",
    select: { followers: 0, following: 0 },
    match: cond,
  });
  data = await adminUser.populate(users, {
    path: "followers",
    select: { followers: 0, following: 0 },
  });
  let arr_following;
  for (let element of data) {
    arr_following = element?.following;
    if (arr_following != undefined) {
      var user_following;
      var users_arr = [];

      for (let e of arr_following) {
        user_following = await connectDetails({
          _id: mongoose.Types.ObjectId(e._id),
        });
        users_arr.push(user_following[0]);
      }
      element.following = users_arr;
    }
    let arr_followers;
    arr_followers = element?.followers;
    if (arr_followers != undefined) {
      var user_followers;
      var user_arr = [];

      for (let e of arr_followers) {
        user_followers = await connectDetails({
          _id: mongoose.Types.ObjectId(e._id),
        });
        user_arr.push(user_followers[0]);
      }
      element.followers = user_arr;
    }
  }

  users = await responseCostBrand(users);

  return users;
}

async function connectDetails(userPara) {
  const query = [
    {
      $lookup: {
        from: "costs",
        localField: "_id",
        foreignField: "user_id",
        as: "costs",
      },
    },
    {
      $unwind: {
        path: "$costs",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "brandinfos",
        localField: "_id",
        foreignField: "user_id",
        as: "brands",
      },
    },
    {
      $unwind: {
        path: "$brands",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $match: userPara,
    },
    {
      $project: {
        followers: 0,
        following: 0,
        token: 0,
      },
    },
  ];

  // console.log("query", JSON.stringify(query, null, 2));
  let users = await adminUser.aggregate(query);

  //  await User.populate(users,{path:"following",select: { 'followers': 0,'following':0}})
  //  await User.populate(users,{path:"followers",select: { 'followers': 0,'following':0}})
  users = await responseCostBrand(users);
  return users;
}

const responseCostBrand = async (users) => {
  for (const e of users) {
    // console.log('e?.followers?.length',e?.followers?.length)
    if (e.profile_image) {
      e.profile_image = process.env.CDN_BASE_URL + e.profile_image;
    }

    if (e.thumbnail_image) {
      e.thumbnail_image = process.env.CDN_BASE_URL + e.thumbnail_image;
    }

    if (e.cover_image) {
      e.cover_image = process.env.CDN_BASE_URL + e.cover_image;
    }

    e.followerscount = e?.followers?.length;
    e.followingcount = e?.following?.length;
    e.tags = e?.costs?.tag || e?.brands?.tag;
    e.productcount = e?.products?.length;
    e.campaigncount = e?.campaign?.length;

    if (e?.cost_update_time && e?.profile_status === "approved") {
      let timeDay = dhm(
        new Date(e?.cost_update_time).getTime() + 1296000000 - Date.now()
      );
      e.time_remaining = timeDay <= 0 ? "0" : timeDay;
      e.is_update = true;
      if (parseInt(e?.time_remaining) <= 0) {
        e.is_update = false;
        // await updateTimedate({is_update:false},e._id)
      }
    }
    //     else{
    //       e.is_update=true
    //      // await updateTimedate({is_update:true},e._id)
    //   }
    // }else if (e?.status == "pending"){
    //   e.is_update=false
    //   //await updateTimedate({is_update:false},e._id)
    // }

    if (e?.brand_update_time && e?.profile_status === "approved") {
      let timeDay = dhm(
        new Date(e?.brand_update_time).getTime() + 1296000000 - Date.now()
      );
      e.is_update = true;
      e.time_remaining = timeDay <= 0 ? "0" : timeDay;
      if (parseInt(e?.time_remaining) <= 0) {
        e.is_update = false;
        await updateTimedate({ is_update: false }, e._id);
      }
      // else{
      // console.log("2")
      // e.is_update=true
      //await updateTimedate({is_update:true},e._id)
      // }
      // }else if (e?.status === "pending" ){
      //   console.log("3")
      //  e.is_update=false
      //await updateTimedate({is_update:false},e._id)
    }

    delete e?.brands?.tag;
    delete e?.costs?.tag;
    delete e?.followers;
    delete e?.following;
    delete e?.products;
    delete e?.campaign;
    delete e?.following_count;
    delete e?.followers_count;
    // delete e?.brand_update_time;
    // delete e?.cost_update_time;
  }

  return users;
};

const updateTimedate = async (updateTime, id) => {
  // console.log("updateTimedate",updateTime, id)
  const data = await adminUser.findByIdAndUpdate(
    { _id: id },
    { $set: updateTime },
    {
      new: true,
    }
  );
};

//@Router router.route("/allusers").get(getuserDetails)
//all User Details
export const getuserDetails = async (req, res, next) => {
  try {
    // console.log("asdfgqweti");
    const facebook = req.query.isfacebook === "true";
    const instagram = req.query.isInstagram === "true";
    let searchdata = req.query.search;
    const phone = req.query.phone || searchdata;
    const facebookname = req.query.facebook_name || searchdata;
    const instagramname = req.query.instagram_name || searchdata;
    const business_name = searchdata;

    let tag = req.query.tag || searchdata;
    let query = "";

    const verify = req.query.profile_status;
    const type = req.query.type_of_user;
    const id = req.query._id;

    let transactionType = req.query.transactiontype;
    // let costQuery = [];
    const admin = req.query.isadmin === "true";

    //pagination
    let currpage, itempage;

    const itemperpage = req.query.itemperpage || 10;
    const currentpageno = req.query.currentpageno || 1;

    const andQuery = [];
    const faceQuery = [];
    if (req.query.isfacebook) {
      andQuery.push({
        is_facebook: facebook,
      });
    }

    if (req.query.isInstagram) {
      andQuery.push({
        is_instagram: instagram,
      });
    }

    if (phone) {
      faceQuery.push({
        phone: { $regex: "^\\+" + phone, $options: "i" },
      });
    }

    if (searchdata) {
      faceQuery.push({
        first_name: { $regex: "^" + searchdata, $options: "i" },
      });
      faceQuery.push({
        last_name: { $regex: "^" + searchdata, $options: "i" },
      });
    }

    if (facebookname) {
      faceQuery.push({
        "facebook_info.name": { $regex: "^" + facebookname, $options: "i" },
      });
    }

    if (instagramname) {
      faceQuery.push({
        "instagram_info.name": { $regex: "^" + instagramname, $options: "i" },
      });
    }

    if (id) {
      andQuery.push({
        _id: mongoose.Types.ObjectId(id),
      });
    }

    if (verify) {
      andQuery.push({
        profile_status: verify,
      });
    }

    if (type) {
      andQuery.push({
        type_of_user: type,
      });
    }

    if (req.query.isadmin) {
      andQuery.push({
        is_admin: admin,
      });
    }

    if (transactionType) {
      andQuery.push({
        "costs.transaction_type": transactionType,
      });
    }

    if (tag) {
      faceQuery.push({
        "costs.tag.name": {
          $regex: "^" + tag,
          $options: "i",
        },
      });
      faceQuery.push({
        "brands.tag.name": {
          $regex: "^" + tag,
          $options: "i",
        },
      });
    }

    if (business_name) {
      faceQuery.push({
        "brands.business_name": { $regex: "^" + business_name, $options: "i" },
      });
    }

    if (currentpageno && itemperpage) {
      currpage = itemperpage * currentpageno - itemperpage;
    }

    if (currentpageno && itemperpage) {
      itempage = parseInt(itemperpage);
    }

    let arrData;
    if (faceQuery.length > 0 && andQuery.length > 0) {
      arrData = {
        $and: andQuery,
        $or: faceQuery,
      };
    } else if (andQuery.length > 0) {
      arrData = {
        $and: andQuery,
      };
    } else if (faceQuery.length > 0) {
      arrData = {
        $or: faceQuery,
      };
    } else {
      arrData = {};
    }

    // let arr;
    // if (costQuery.length > 0) {
    //   arr = {
    //     $and: costQuery,
    //   };
    // } else {
    //   arr = {};
    // }

    query = [
      {
        $lookup: {
          from: "costs",
          localField: "_id",
          foreignField: "user_id",
          as: "costs",
        },
      },
      {
        $unwind: {
          path: "$costs",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "brandinfos",
          localField: "_id",
          foreignField: "user_id",
          as: "brands",
        },
      },
      {
        $unwind: {
          path: "$brands",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "campaigns",
          localField: "_id",
          foreignField: "user_id",
          as: "campaign",
        },
      },
      {
        $match: arrData,
      },
      // {
      //   $match: arr,
      // },
      {
        $project: {
          followers: 0,
          following: 0,
          token: 0,
        },
      },
      {
        $skip: currpage,
      },
      {
        $limit: itempage,
      },
      {
        $sort: { createdAt: -1 },
      },
    ];

    //  console.log("query",JSON.stringify(query,2,null))
    let users = await adminUser.aggregate(query);
    //  users = await responseCostBrand(users);
    // for (const e of users) {
    //   if (e.profile_image) {
    //     e.profile_image = process.env.CDN_BASE_URL + e.profile_image;
    //   }

    //   if (e.thumbnail_image) {
    //     e.thumbnail_image = process.env.CDN_BASE_URL + e.thumbnail_image;
    //   }

    //   if (e.cover_image) {
    //     e.cover_image = process.env.CDN_BASE_URL + e.cover_image;
    //   }

    //   e.tags = e?.costs?.tag || e?.brands?.tag;
    //   delete e?.brands?.tag;
    //   delete e?.costs?.tag;
    // }

    // return users;

    // users = await User.populate(usersdata,{path:"followers"})
    //  let  users = await User.populate(users1,{path:"followers"})
    // users = await responseCostBrand(users);
    //  console.log("time",new Date().getMilliseconds())
    for (const e of users) {
      if (e.profile_image) {
        e.profile_image = process.env.CDN_BASE_URL + e.profile_image;
      }

      if (e.thumbnail_image) {
        e.thumbnail_image = process.env.CDN_BASE_URL + e.thumbnail_image;
      }

      if (e.cover_image) {
        e.cover_image = process.env.CDN_BASE_URL + e.cover_image;
      }

      e.tags = e?.costs?.tag || e?.brands?.tag;
      e.campaigncount = e?.campaign?.length;
      delete e?.brands?.tag;
      delete e?.costs?.tag;
      delete e?.campaign;
      // return users
    }

    // return users;
    return res.status(200).json({
      success: true,
      user: users,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

// export const admingetuserDetails = async (req, res, next) => {
//   try {
//     const facebook = req.query.isfacebook === "true";
//     const instagram = req.query.isInstagram === "true";
//     let searchdata = req.query.search;
//     const phone = req.query.phone || searchdata;
//     const facebookname = req.query.facebook_name || searchdata;
//     const instagramname = req.query.instagram_name || searchdata;
//     let tag = req.query.tag || searchdata;
//     const business_name = searchdata;
//     let query = "";

//     const verify =req.query.profile_status;
//     console.log("verify",verify)
//     const type = req.query.type_of_user;
//     const id = req.query._id;
//     let transactionType = req.query.transactiontype;
//     // let costQuery = [];
//     // let tagdata ={};
//     const admin = req.query.isadmin === "true";

//     //pagination
//     let currpage, itempage;
//     const itemperpage = req.query.itemperpage || 10;
//     const currentpageno = req.query.currentpageno || 1;

//     const andQuery = [];
//     const faceQuery = [];
//     if (req.query.isfacebook) {
//       andQuery.push({
//         is_facebook: facebook,
//       });
//     }

//     if (req.query.isInstagram) {
//       andQuery.push({
//         is_instagram: instagram,
//       });
//     }

//     if (phone) {
//       faceQuery.push({
//         phone: { $regex: "^\\+" + phone, $options: "i" },
//       });
//     }

//     if (searchdata) {
//       faceQuery.push({
//         first_name: { $regex: "^" + searchdata, $options: "i" },
//       });
//       faceQuery.push({
//         last_name: { $regex: "^" + searchdata, $options: "i" },
//       });
//     }

//     if (facebookname) {
//       faceQuery.push({
//         "facebook_info.name": { $regex: "^" + facebookname, $options: "i" },
//       });
//     }

//     if (instagramname) {
//       faceQuery.push({
//         "instagram_info.name": { $regex: "^" + instagramname, $options: "i" },
//       });
//     }

//     if (id) {
//       andQuery.push({
//         _id: mongoose.Types.ObjectId(id),
//       });
//     }
//     if (verify) {
//       andQuery.push({
//         profile_status: verify,
//       });
//     }

//     if(type == "customer"){
//       andQuery.push({
//         type_of_user: undefined,
//       });
//     }
//     else if (type == "brand" || type == "influencer") {
//       andQuery.push({
//         type_of_user: type,
//       });
//     }

//     if (req.query.isadmin) {
//       andQuery.push({
//         is_admin: admin,
//       });
//     }

//     if (transactionType) {
//       andQuery.push({
//         "costs.transaction_type": transactionType,
//       });
//     }

//     if (tag) {
//       faceQuery.push({
//         "costs.tag.name": {
//           $regex: "^" + tag,
//           $options: "i",
//         },
//       });

//       faceQuery.push({
//         "brands.tag.name": {
//           $regex: "^" + tag,
//           $options: "i",
//         },
//       });
//     }

//     if (business_name) {
//       faceQuery.push({
//         "brands.business_name": { $regex: "^" + business_name, $options: "i" },
//       });
//     }

//     if (currentpageno && itemperpage) {
//       currpage = itemperpage * currentpageno - itemperpage;
//     }

//     if (currentpageno && itemperpage) {
//       itempage = parseInt(itemperpage);
//     }

//     let arrData;
//     if (faceQuery.length > 0 && andQuery.length > 0) {
//       arrData = {
//         $and: andQuery,
//         $or: faceQuery,
//       };
//     } else if (andQuery.length > 0) {
//       arrData = {
//         $and: andQuery,
//       };
//     } else if (faceQuery.length > 0) {
//       arrData = {
//         $or: faceQuery,
//       };
//     } else {
//       arrData = {};
//     }

//     // let arrData;
//     // if (andQuery.length > 0) {
//     //   arrData = {
//     //     $and: andQuery,
//     //   };
//     // }else {
//     //   arrData = {};
//     // }

//     // let arr;
//     // if (costQuery.length > 0) {
//     //   arr = {
//     //     $and: costQuery,
//     //   };
//     // } else {
//     //   arr = {};
//     // }

//     query = [
//       {
//         $lookup: {
//           from: "costs",
//           localField: "_id",
//           foreignField: "user_id",
//           as: "costs",
//         },
//       },
//       {
//         $unwind: {
//           path: "$costs",
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $lookup: {
//           from: "brandinfos",
//           localField: "_id",
//           foreignField: "user_id",
//           as: "brands",
//         },
//       },
//       {
//         $unwind: {
//           path: "$brands",
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $match: arrData,
//       },
//       // {
//       //   $match: arr,
//       // },
//       {
//         $project: {
//           // followers: 0,
//           // following: 0,
//           token: 0,
//         },
//       },
//       {
//         $sort : { createdAt : -1 }
//       },
//       {
//         $skip: currpage,
//       },
//       {
//         $limit: itempage,
//       }
//     ];
//     // console.log("query",JSON.stringify(query,2,null))

//     let users = await User.aggregate(query);

//     let data =await User.populate(users,{path:"following",select: { 'followers': 0,'following':0}})
//      data= await User.populate(users,{path:"followers",select: { 'followers': 0,'following':0}})

//     for (let element of data) {
//       console.log("element11111",element?.following)
//       let arr_following=element?.following

//        if(arr_following != undefined){
//         var user_following
//         var users_arr =[]
//         for(let e of arr_following){
//           // console.log("ff",e._id)
//           user_following = await connectDetails({_id:mongoose.Types.ObjectId(e._id)})
//           //  if(e._id)
//           users_arr.push(user_following[0])
//          }
//          element.following =users_arr
//        }

//        let arr_followers= element?.followers
//        if(arr_followers != undefined){
//         var user_followers
//         var user_arr =[]
//         for(let e of arr_followers){
//           // console.log("ff",e._id)
//           user_followers = await connectDetails({_id:mongoose.Types.ObjectId(e._id)})
//           //  if(e._id)
//           user_arr.push(user_followers[0])
//          }
//          element.followers =user_arr
//        }
//     }

//     // users = await User.populate(usersdata,{path:"followers"})
//     //  let  users = await User.populate(users1,{path:"followers"})

//     users = await responseCostBrand(users);

//     return res.status(200).json({
//       success: true,
//       user: users,
//     });
//   } catch (error) {
//     console.log("error", error);
//     return res.status(500).json(errors.SERVER_ERROR);
//   }
// };

export const admingetuserDetails = async (req, res, next) => {
  try {
    const facebook = req.query.isfacebook === "true";
    const instagram = req.query.isInstagram === "true";
    const test_user = req.query.test_user === "true";
    let searchdata = req.query.search;
    const phone = req.query.phone || searchdata;
    const facebookname = req.query.facebook_name || searchdata;
    const instagramname = req.query.instagram_name || searchdata;
    let tag = req.query.tag || searchdata;
    const business_name = searchdata;
    let query = "";

    const verify = req.query.profile_status;
    const type = req.query.type_of_user;
    const id = req.query._id;
    let transactionType = req.query.transactiontype;
    // let costQuery = [];
    // let tagdata ={};
    const admin = req.query.isadmin === "true";

    //pagination
    let currpage, itempage;
    const itemperpage = req.query.itemperpage || 10;
    const currentpageno = req.query.currentpageno || 1;

    if (Object.entries(req.query).length > 0) {
      const andQuery = [];
      const faceQuery = [];
      if (req.query.isfacebook) {
        andQuery.push({
          is_facebook: facebook,
        });
      }

      if (req.query.isInstagram) {
        andQuery.push({
          is_instagram: instagram,
        });
      }

      if (phone) {
        faceQuery.push({
          phone: { $regex: "^\\+" + phone, $options: "i" },
        });
      }

      if (searchdata) {
        faceQuery.push({
          first_name: { $regex: "^" + searchdata, $options: "i" },
        });
        faceQuery.push({
          last_name: { $regex: "^" + searchdata, $options: "i" },
        });
      }

      if (facebookname) {
        faceQuery.push({
          "facebook_info.name": { $regex: "^" + facebookname, $options: "i" },
        });
      }

      if (instagramname) {
        faceQuery.push({
          "instagram_info.name": { $regex: "^" + instagramname, $options: "i" },
        });
      }

      if (id) {
        andQuery.push({
          _id: mongoose.Types.ObjectId(id),
        });
      }
      if (verify) {
        andQuery.push({
          profile_status: verify,
        });
      }
      if (req.query.test_user) {
        andQuery.push({
          test_user: test_user,
        });
      }
      if (type == "customer") {
        // console.log("customer");
        andQuery.push({
          type_of_user: undefined,
        });
      } else if (type == "brand" || type == "influencer") {
        andQuery.push({
          type_of_user: type,
        });
      }

      if (req.query.isadmin) {
        andQuery.push({
          is_admin: admin,
        });
      }

      if (transactionType) {
        andQuery.push({
          "costs.transaction_type": transactionType,
        });
      }

      if (tag) {
        faceQuery.push({
          "costs.tag.name": {
            $regex: "^" + tag,
            $options: "i",
          },
        });

        faceQuery.push({
          "brands.tag.name": {
            $regex: "^" + tag,
            $options: "i",
          },
        });
      }

      if (business_name) {
        faceQuery.push({
          "brands.business_name": {
            $regex: "^" + business_name,
            $options: "i",
          },
        });
      }

      if (currentpageno && itemperpage) {
        currpage = itemperpage * currentpageno - itemperpage;
      }

      if (currentpageno && itemperpage) {
        itempage = parseInt(itemperpage);
      }

      let arrData;
      if (faceQuery.length > 0 && andQuery.length > 0) {
        arrData = {
          $and: andQuery,
          $or: faceQuery,
        };
      } else if (andQuery.length > 0) {
        arrData = {
          $and: andQuery,
        };
      } else if (faceQuery.length > 0) {
        arrData = {
          $or: faceQuery,
        };
      } else {
        arrData = {};
      }

      // let arrData;
      // if (andQuery.length > 0) {
      //   arrData = {
      //     $and: andQuery,
      //   };
      // }else {
      //   arrData = {};
      // }

      // let arr;
      // if (costQuery.length > 0) {
      //   arr = {
      //     $and: costQuery,
      //   };
      // } else {
      //   arr = {};
      // }

      query = [
        {
          $lookup: {
            from: "costs",
            localField: "_id",
            foreignField: "user_id",
            as: "costs",
          },
        },
        {
          $unwind: {
            path: "$costs",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "brandinfos",
            localField: "_id",
            foreignField: "user_id",
            as: "brands",
          },
        },
        {
          $unwind: {
            path: "$brands",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "user_id",
            as: "products",
          },
        },
        {
          $lookup: {
            from: "campaigns",
            localField: "_id",
            foreignField: "user_id",
            as: "campaign",
          },
        },
        {
          $match: arrData,
        },
        // {
        //   $match: arr,
        // },
        {
          $project: {
            // followers: 0,
            // following: 0,
            brand_update_time: 0,
            cost_update_time: 0,
            token: 0,
          },
        },
        // {
        //   $count:'phone'
        // },
        // {
        //   $skip: currpage,
        // },
        // {
        //   $limit: itempage,
        // },
        {
          $sort: { createdAt: -1 },
        },
      ];
      // console.log("query",JSON.stringify(query,2,null))
      query.push({
        $match: {},
      });

      // console.log("type_of-ser",type)

      let total_records = await adminUser.aggregate(query);
      // const datatot = total_records.length;
      // console.log("data", datatot);

      let approvedCount = 0,
        pendingCount = 0,
        suspendCount = 0,
        brandCount = 0;
      let approvedCountInf = 0,
        pendingCountInf = 0,
        suspendCountInf = 0,
        infCount = 0;
      let customerCount = 0;
      total_records.map((e) => {
        if (e.type_of_user === "brand") {
          brandCount = brandCount + 1;
          // console.log('brandCount',brandCount)
          if (e.profile_status == "approved") {
            approvedCount = approvedCount + 1;
            // console.log(e.status.length)
          } else if (e.profile_status == "pending") {
            pendingCount = pendingCount + 1;
          } else if (e.profile_status == "suspended") {
            suspendCount = suspendCount + 1;
          }
        } else if (e.type_of_user === "influencer") {
          infCount = infCount + 1;
          // console.log('infcount',infCount)
          if (e.profile_status == "approved") {
            approvedCountInf = approvedCountInf + 1;
            // console.log(e.status.length)
          } else if (e.profile_status == "pending") {
            pendingCountInf = pendingCountInf + 1;
          } else if (e.profile_status == "suspended") {
            suspendCountInf = suspendCountInf + 1;
          }
        } else if (e.type_of_user == undefined) {
          customerCount = customerCount + 1;
        }
      });
      // console.log("approvedCount",approvedCountInf)
      // console.log("pendingCount",pendingCountInf)
      // console.log("suspendCount",suspendCountInf)

      // console.log("brandCount",brandCount)
      // console.log("infCount",infCount)

      // console.log("total_records", total_records.length);

      let aggregateArrayWithPagination = query.concat([
        { $skip: currpage },
        { $limit: itempage },
      ]);

      let users = await adminUser.aggregate(aggregateArrayWithPagination);

      let data = await User.populate(users, {
        path: "following",
        select: { followers: 0, following: 0 },
      });
      data = await User.populate(users, {
        path: "followers",
        select: { followers: 0, following: 0 },
      });

      for (let element of data) {
        // console.log("element11111",element?.following)
        let arr_following = element?.following;

        if (arr_following != undefined) {
          var user_following;
          var users_arr = [];
          for (let e of arr_following) {
            // console.log("ff",e._id)
            user_following = await connectDetails({
              _id: mongoose.Types.ObjectId(e._id),
            });
            //  if(e._id)
            users_arr.push(user_following[0]);
          }
          element.following = users_arr;
        }

        let arr_followers = element?.followers;
        if (arr_followers != undefined) {
          var user_followers;
          var user_arr = [];
          for (let e of arr_followers) {
            // console.log("ff",e._id)
            user_followers = await connectDetails({
              _id: mongoose.Types.ObjectId(e._id),
            });
            //  if(e._id)
            user_arr.push(user_followers[0]);
          }
          element.followers = user_arr;
        }
      }

      // users = await User.populate(usersdata,{path:"followers"})
      //  let  users = await User.populate(users1,{path:"followers"})

      users = await responseCostBrand(users);

      return res.status(200).json({
        success: true,
        user: users,
        total_records: total_records.length,
        brandApprovedCount: approvedCount,
        brandPendingCount: pendingCount,
        brandSuspendCount: suspendCount,
        infuencerApprovedCount: approvedCountInf,
        infuencerPendingCount: pendingCountInf,
        infuencerSuspendCount: suspendCountInf,
        brandCount: brandCount,
        infuencerCount: infCount,
        customerCount,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Invalid request ",
      });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

//@Router router.route("/me").get(isAuthentication,getuser);
//get login user details
export const getuser = async (req, res, next) => {
  try {
    const search = req.query.search;
    const type = req.query.type_of_user;
    const users = await userDetails(
      { _id: mongoose.Types.ObjectId(req.user.id) },
      search,
      type
    );

    return res.status(201).json({
      success: true,
      user: users[0],
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

//@Router router.route("/me").get(isAuthentication,getuser);
//get login user details
export const getuserFollowers = async (req, res, next) => {
  try {
    // console.log('getuserFollowers', req.query);
    const userId = req.query.id;
    // const type = req.query.type_of_user;
    // const users = await userDetails(
    //   { _id: mongoose.Types.ObjectId(req.user.id) },
    //   search,
    //   type
    // );
    // console.log(" getuserFollowers user id ::", userId);
    const user = await User.find({
      _id: mongoose.Types.ObjectId(userId),
    }).populate({
      path: "followers",
      select: { first_name: 1, last_name: 1, profile_image: 1 },
    });
    // console.log("getuserFollowers user", user[0]?.followers);

    for (const e of user[0]?.followers) {
      // console.log('e?.followers?.length',e?.followers?.length)
      // console.log('e',e)
      if (e?.profile_image) {
        e.profile_image = process.env.CDN_BASE_URL + e.profile_image;
      }
    }

    return res.status(201).json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

export const getuserFollowing = async (req, res, next) => {
  try {
    // console.log('getuserFollowing', req.query);
    const userId = req.query.id;
    // const type = req.query.type_of_user;
    // const users = await userDetails(
    //   { _id: mongoose.Types.ObjectId(req.user.id) },
    //   search,
    //   type
    // );
    // console.log(" getuserFollowing user id ::", userId);
    const user = await User.find({
      _id: mongoose.Types.ObjectId(userId),
    }).populate({
      path: "following",
      select: { first_name: 1, last_name: 1, profile_image: 1 },
    });
    // console.log("getuserFollowing user", user[0]?.following);

    for (const e of user[0]?.following) {
      // console.log('e?.followers?.length',e?.followers?.length)
      // console.log('e',e)
      if (e?.profile_image) {
        e.profile_image = process.env.CDN_BASE_URL + e.profile_image;
      }
    }
    return res.status(201).json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

// @Router router.route("/deleteme").delete(isAuthentication,deleteUser)
//delete User
export const deleteUser = async (req, res, next) => {
  try {
    const user = req.user.flag;
    // console.log("data1234", user, req.params);
    const userId = mongoose.Types.ObjectId(req.params);
    // console.log("userId", userId);

    if (req.user.flag == "true") {
      //userid wise all table record delete
      const user = await adminUser.findByIdAndDelete({ _id: userId });
      // console.log("use...r", user);
      const costs = await Cost.deleteOne({ user_id: userId });
      const brands = await brandinfo.deleteOne({ user_id: userId });
      const campaign = await Campaign.deleteOne({ user_id: userId });
      const product = await Product.deleteOne({ user_id: userId });
      const wishlist = await wishList.deleteMany({ user_id: userId });
      const rentproduct = await Rent.deleteMany({ user_id: userId });
      // const spamdelete = await SpamReport.deleteMany({user_id:userId })
      // const spamUserdelete = await SpamReport.deleteMany({spam_user_id:userId })
      // const tags = await Tag.deleteMany({ user_id: userId });

      // const allUser = await User.find()

      // allUser.forEach(ele => {
      //   if (ele?.followers.lenght > 0){
      //     console.log("1")
      //   ele?.followers?.filter((e)=>{
      //     console.log("e followers",followers)
      //     if(e?.toString() == user_id){
      //       console.log(user_id)
      //       e.remove(user_id)
      //     }
      //   })
      // }
      // });

      // allUser.forEach(ele => {
      //   ele?.following?.filter((e)=>{
      //     console.log("e following",e)
      //     if(e?.toString() == user_id){
      //       console.log(user_id)
      //       e.remove(user_id)
      //     }
      //   })
      // });

      return res.status(200).json({
        success: true,
        message: "Delete successfully",
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

//@Router router.route("/deleteadminuser").delete(isAuthentication,deleteadminUser);
//admin delete user
// exports.deleteadminUser = async (req, res, next) => {
//   try {
//     const { userId } = req.body;

//     if (!userId) {
//       return res.status(400).json(errors.MANDATORY_FIELDS);
//     }

//     const adminId = req.user.is_admin;
//     if (adminId == true) {
//       const userData = await User.findById({ _id: userId });
//       if (!userData) {
//         return res.status(400).json(errors.INVALID_FIELDS);
//       }

//       //userid wise all table record delete
//       const user = await User.findByIdAndDelete({ _id: userId });
//       const costs = await Cost.deleteOne({ user_id: userId });
//       const brands = await BrandInfo.deleteOne({ user_id: userId });

//       // const tags = await Tag.deleteMany({ user_id: userId });
//       return res.status(201).json({
//         success: true,
//         message: "Delete successfully.",
//       });
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: "Only admin can delete user... ",
//       });
//     }
//   } catch (error) {
//     console.log("error", error);
//     return res.status(500).json(errors.SERVER_ERROR);
//   }
// };

// admin update user details
// exports.adminUpdateUserDetails = async (req, res, next) => {
//   try {
//     console.log("time",new Date().getTime())
//     let cost_update_time, is_update, brand_update_time;
//     // status
//     const {
//       user_id,
//       type_of_user,
//       first_name,
//       last_name,
//       facebook_username,
//       instagram_username,
//       youtube_username,
//       youtube_followers,
//       instagram_followers,
//       facebook_followers,
//       is_admin,
//       cost,
//       transaction_type,
//       tag,
//       address,
//       city,
//       state,
//       country,
//       business_name,
//       store_website,
//       type_of_brand,
//     } = req.body;

//     let tran_type = transaction_type && transaction_type.toLowerCase();
//     console.log("tran_type", tran_type);
//     let user_type = type_of_user && type_of_user.toLowerCase();
//     let brand_type = type_of_brand && type_of_brand.toLowerCase();
//     // let user_status = status&&status.toLowerCase()

//     if (req.user.is_admin === true) {
//       if (!user_id) {
//         return res.status(400).json(errors.MANDATORY_FIELDS);
//       }

//       // if(user_status){
//       //   if(user_status == "approved") {is_update=false}
//       //   if(user_status == "suspended") {is_update=true}
//       //   cost_update_time = 0
//       //   brand_update_time = 0
//       // }

//       const user = await User.findById({ _id: user_id });
//       const brand = await BrandInfo.find({ user_id });
//       // console.log("11111111",brand, brand.length === 0 && ( user_type === "brand" || ( user_type === "brand" && user.type_of_user === undefined)))
//       // if(user.type_of_user === "influencer" && type_of_user === "brand" || ( type_of_user === "influencer" || user.type_of_user === undefined) ){
//       if (
//         brand.length === 0 &&
//         (user_type === "brand" ||
//           (user_type === "brand" && user.type_of_user === undefined))
//       ) {
//         const cost = await Cost.deleteOne({ user_id: user.id });
//         if (!brand_type) {
//           return res.status(400).json(errors.MANDATORY_FIELDS);
//         }
//         const brand = await BrandInfo.create({
//           user_id,
//           type_of_brand: brand_type,
//         });
//         cost_update_time = 0;
//         is_update = false;
//       }

//       const costdata = await Cost.find({ user_id: user_id });
//       // console.log("2222",costdata, costdata.length === 0 &&  (user_type === "influencer" || ( user_type === "influencer" && user.type_of_user === undefined)))
//       // if((user.type_of_user === "brand" && type_of_user === "influencer" )|| (user.type_of_user === undefined || user.type_of_user === "influencer" && type_of_user === "influencer")){
//       if (
//         costdata.length === 0 &&
//         (user_type === "influencer" ||
//           (user_type === "influencer" && user.type_of_user === undefined))
//       ) {
//         const brand = await BrandInfo.deleteOne({ user_id: user.id });
//         const cost = await Cost.create({
//           user_id: user.id,
//         });
//         brand_update_time = 0;
//         is_update = false;
//       }

//       //,status:user_status
//       const userUpdate = await User.findByIdAndUpdate(
//         { _id: user_id },
//         {
//           $set: {
//             type_of_user: user_type,
//             is_admin,
//             cost_update_time,
//             is_update,
//             brand_update_time,
//             first_name,
//             last_name,
//             facebook_username,
//             instagram_username,
//             youtube_username,
//             youtube_followers,
//             instagram_followers,
//             facebook_followers,
//             "instagram_info.instagram_followers": instagram_followers,
//             "facebook_info.facebook_followers": facebook_followers,
//           },
//         },
//         {
//           new: true,
//         }
//       );

//       const costUpdate = await Cost.findOneAndUpdate(
//         { user_id: user_id },
//         { $set: { cost, transaction_type: tran_type, tag } },
//         {
//           new: true,
//         }
//       );

//       const brandUpdate = await BrandInfo.findOneAndUpdate(
//         { user_id: user_id },
//         {
//           $set: {
//             tag,
//             business_name,
//             address,
//             city,
//             state,
//             country,
//             store_website,
//             type_of_brand: brand_type,
//           },
//         },
//         {
//           new: true,
//         }
//       );
//       console.log("time",new Date().getTime())
//       const users = await userDetails({
//         _id: mongoose.Types.ObjectId(user_id),
//       });
//       console.log("time",new Date().getTime())
//       return res.status(200).json({
//         success: true,
//         user: users[0],
//       });
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: " Only admin can edit user details.",
//       });
//     }
//   } catch (error) {
//     console.log("error", error);
//     return res.status(500).json(errors.SERVER_ERROR);
//   }
// };

//@Router router.route("/me").get(isAuthentication,getuser);
//get login user details
// exports.admingetuser = async (req, res, next) => {
//   try {
//     const { user_id } = req.body;
//     if (req.user.is_admin === true) {
//       if (!user_id) {
//         return res.status(400).json(errors.MANDATORY_FIELDS);
//       }
//       const users = await userDetails({
//         _id: mongoose.Types.ObjectId(user_id),
//       });
//       return res.status(201).json({
//         success: true,
//         user: users[0],
//       });
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: " Only admin can get user details.",
//       });
//     }
//   } catch (error) {
//     console.log("error", error);
//     return res.status(500).json(errors.SERVER_ERROR);
//   }
// };

const uploadFile = (data, name) => {
  return new Promise((resolve, reject) => {
    try {
      // console.log("env", process.env.AWS_S3_SECRET_ACCESS_KEY);
      aws.config.update({
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        region: process.env.AWS_S3_REGION,
      });

      const s3 = new aws.S3();
      const key = `secure/kristagram/${name}.jpg`;

      //covert base64 to buffer
      const buffer = Buffer.from(data, "base64");

      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key, // File name you want to save as in S3
        Body: buffer, // passed buffer data
        ACL: "public-read",
        region: process.env.AWS_S3_REGION,
        ContentEncoding: "base64",
        ContentType: `image/jpeg`,
      };

      // Uploading files to the bucket
      s3.upload(params, function (err, data) {
        if (err) {
          return reject(err);
        }
        var path = data.Key;

        resolve(path);
      });
    } catch (error) {
      console.log("error", error);
      return reject(error);
    }
  });
};

// exports.adminProfileCoverimage = async (req, res, next) => {
//   try {
//     if (req.user.is_admin === true) {
//       const { user_id } = req.body;

//       var datetime = new Date().getTime();
//       let filePath, thumbnailfile, coverPath;
//       if (req.files.photo) {
//         let pic = req.files.photo.data;
//         filePath = await uploadFile(pic, `${user_id}/profie_${datetime}`);
//         thumbnailfile = await uploadFile(
//           pic,
//           `${user_id}/thumbnail_${datetime}`
//         );
//       }

//       if (req.files.cover_image) {
//         let cover = req.files.cover_image.data;
//         coverPath = await uploadFile(cover, `${user_id}/cover_${datetime}`);
//       }

//       const user = await User.findByIdAndUpdate(
//         { _id: user_id },
//         {
//           $set: {
//             profile_image: filePath,
//             thumbnail_image: thumbnailfile,
//             cover_image: coverPath,
//           },
//         },
//         {
//           new: true,
//         }
//       );

//       const users = await userDetails({
//         _id: mongoose.Types.ObjectId(user_id),
//       });

//       return res.status(200).json({
//         success: true,
//         user: users[0],
//       });
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: " Only admin can edit user details.",
//       });
//     }
//   } catch (error) {
//     console.log("error", error);
//     return res.status(500).json(errors.SERVER_ERROR);
//   }
// };

export const logOut = async (req, res) => {
  try {
    if (req.user.flag === "true") {
      const data = await AdminUser.findByIdAndDelete({
        _id: mongoose.Types.ObjectId(req.user.id),
      });
      console.log("data ddd", data);
    }
    res.clearCookie("token");
    return res.status(200).json({ message: "logged out" });

    // console.log("idddd+++++", req.user.id,req.user.email);
    // const data = await AdminUser.findByIdAndUpdate(
    //   { _id: req.user.id },
    //   { $set: { flag: "false"} },
    //   { new: true }
    // );
    // const WebAdminUser = await WebAdminUserAccess.updateOne(
    //   { email:  req.user.email },
    //   {
    //     $set: {
    //       is_critical:false,
    //     },
    //   }
    // );
    // console.log("data____----",data,WebAdminUser)
  } catch (error) {
    console.log(error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

export const locationUser = async (req, res) => {
  try {
    // console.log("idddd", req.user.id);

    const { userId, country, city, state, pin_code, currency, test_user } =
      req.body;
    console.log(
      "userId, country, city, state, pin_code,currency",
      userId,
      country,
      city,
      state,
      pin_code,
      currency,
      test_user
    );
    if (req.user.flag == "true") {
      const data = await User.findByIdAndUpdate(
        { _id: userId },
        { $set: { country, city, state, pin_code, currency, test_user } },
        { new: true }
      );
      // console.log("location", data);

      return res.status(200).json({
        success: true,
        user: data,
      });
    } else {
      return res.status(400).json({
        message: errors.INVALID_FIELDS,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};
