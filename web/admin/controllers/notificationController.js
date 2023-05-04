import mongoose from "mongoose";
import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";

export const notifyMsg = async (req, res) => {
  try {
    // find fcm token by user device_id
    console.log("user _id", req.body);
    const userNotification = await User.findOne({
      _id: mongoose.Types.ObjectId(req.body.id),
    }).select({ device_id: 1 });

    console.log("userNotification", userNotification);

    const fcm_token = await Notification.findOne({
      device_id: userNotification?.device_id,
    });
    console.log("fcm_token", fcm_token.fcm_token);

    return res.status(201).json({
        success: true,
        fcm_token:fcm_token.fcm_token,
      });

   
  } catch (error) {
    console.log("error while calling notifyMsg api", error);
  }
};
