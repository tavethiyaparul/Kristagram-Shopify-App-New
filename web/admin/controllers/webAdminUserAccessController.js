import mongoose from "mongoose";
import AdminUser from "../models/adminUserModel.js";

import WebAdminUserAccess from "../models/webAdminUserAccessModel.js";
import errors from "../utils/errors.js";

//create web admin user
export const createWebAdminUserAccess = async (req, res, next) => {
  try {
    // console.log("req.body", req.body);
    const { email, user_access } = req.body;
    let uEmail = email.toLowerCase();
    const userEmail = await AdminUser.find({ email: uEmail });
    if (userEmail != "") {
      return res.status(400).json({
        success: false,
        message: "Already exist email",
      });
    }
    console.log("userEmail", userEmail);
    const UserAccessData = await AdminUser.create({
      email,
      user_access,
      flag: "false",
    });
    // console.log("UserAccessData", UserAccessData);
    return res.status(201).json({
      success: true,
      WebAdminUser: UserAccessData,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

// get web admin user /getuser
export const getWebAdminUserAccess = async (req, res) => {
  try {
    const WebAdminUser = await AdminUser.find({ flag: { $ne: "true" } }).sort({
      createdAt: -1,
    });
    console.log("get WebAdminUser", WebAdminUser);
    return res.status(200).json({
      success: true,
      WebAdminUser: WebAdminUser,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

//get department name
export const getDepartment = async (req, res) => {
  try {
    const WebAdminUser = await WebAdminUserAccess.find({});

    let department = [];
    WebAdminUser.map((e) => {
      e.user_access.map((as) => {
        department.push(as);
      });
    });
    const uniqueValues = [...new Set(department)];

    let objUniq = [];
    for (const i of uniqueValues) {
      const data = await WebAdminUserAccess.find({ user_access: { $in: [i] } });
      objUniq.push(data);
    }

    return res.status(200).json([
      {
        success: true,
        department: uniqueValues,
        departmentWiseObj: objUniq,
      },
    ]);
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

// update web admin user
export const updateWebAdminUserAccess = async (req, res, next) => {
  try {
    const { id, email, user_access } = req.body;
    // console.log("req.body", req.body);
    const WebAdminUser = await AdminUser.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(id) },
      {
        $set: {
          email,
          user_access,
        },
      },
      {
        new: true,
      }
    );
    // console.log("WebAdminUser", WebAdminUser);
    res.status(200).json({
      success: true,
      WebAdminUser,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

//update with multi email for assign access
export const updateUserAccessFromMultiEmail = async (req, res, next) => {
  try {
    const { emails } = req.body;
    console.log("req.body", req.body, emails);
    const WebAdminUser = await AdminUser.updateMany(
      { email: { $in: emails } },
      {
        $set: {
          [`user_access.${0}`]: "admin_user",
        },
      }
    );
    console.log("WebAdminUser", WebAdminUser);
    const otherUser = await AdminUser.find({ flag: { $ne: "true" } }).updateMany(
      { email: { $nin: emails } },
      {
        $set: {
          [`user_access.${0}`]: "",
        },
      }
    );
    console.log("otherUser", otherUser);
    res.status(200).json({
      success: true,
      WebAdminUser,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

// delete web admin user
export const deleteWebAdminUserAccess = async (req, res, next) => {
  try {
    console.log("req.user.id", req.params);

    const webAdminUserId = mongoose.Types.ObjectId(req.params);
    // find object from email
    // let emailFind = await AdminUser.findOne({
    //   _id: webAdminUserId,
    // }).select("email");
    // console.log("emailFind", emailFind);

    // delete user
    // const webAdminUser = await AdminUser.findByIdAndUpdate(
    //   {_id: mongoose.Types.ObjectId(webAdminUserId)},
    //   {
    //     $set:{
    //       token:null,
    //       googleId:null
    //     }
    //   },{
    //     new:true
    //   }

    // );
    const webAdminUser=await AdminUser.findByIdAndDelete({ _id: webAdminUserId });

    // const webAdminUser2ndTAble = await AdminUser.findOneAndDelete({
    //   email: emailFind.email,
    // });
    console.log("webAdminUser", webAdminUser,);

    res.status(201).json({
      success: true,
      message: "Delete successfully",
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};
