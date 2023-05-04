import mongoose from "mongoose";
import AppStatus from "../models/appStatusModel.js";
import errors from "../utils/errors.js";

export const getAppStatus = async (req, res) => {
  try {
    const appStatus = await AppStatus.find({});
    return res.status(200).json({
      success: true,
      app: appStatus,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

export const createAppStatus = async (req, res) => {
  try {
    // console.log("req.body", req.body);
    const { forcefullyUpdate, iosVersion, androidVersion } = req.body;
    const data = await AppStatus.find({});
    let appStatus;
    if (req.user.flag == "true") {
      if (data.length > 0) {
        const adminIdArr = data[0].admin_id;
        let arr = adminIdArr.filter((e) => e != req.user.id);
        // console.log("arr1", arr);
        arr?.push(req.user.id);
        // console.log("arr", arr);
        appStatus = await AppStatus.findByIdAndUpdate(
          { _id: data[0]._id },
          {
            $set: {
              forcefullyUpdate: forcefullyUpdate,
              iosVersion: iosVersion,
              androidVersion: androidVersion,
              // admin_id: arr,
            },
          },
          { new: true }
        );
      } else {
        appStatus = await AppStatus.create({
          forcefullyUpdate: forcefullyUpdate,
          iosVersion: iosVersion,
          androidVersion: androidVersion,
          // admin_id: req.user.id,
        });
      }
      return res.status(201).json({
        success: true,
        app: appStatus[0],
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

export const updateAppStatus = async (req, res, next) => {
  try {
    const {
      id,
      location_radius,
      contain,
      font_size,
      font_color,
      contain_more,
      font_size_more,
      font_color_more,
    } = req.body;
    console.log(
      "req.body",
      req.body,
      contain_more,
      font_size_more,
      font_color_more
    );
    let AppStatusUpdated;
    if (location_radius) {
      AppStatusUpdated = await AppStatus.updateOne(
        { _id: mongoose.Types.ObjectId(id) },
        {
          location_radius,
        },

        {
          new: true,
        }
      );
    } else if (contain) {
      AppStatusUpdated = await AppStatus.updateOne(
        { _id: mongoose.Types.ObjectId(id) },
        {
          // $set: {
          // location_radius,
          location_with_no_selection: {
            contain,
            font_size,
            font_color,
          },
        },
        // },

        {
          new: true,
        }
      );
    } else {
      AppStatusUpdated = await AppStatus.updateOne(
        { _id: mongoose.Types.ObjectId(id) },
        {
          // $set: {
          // location_radius,
          location_with_no_more_selected_result: {
            contain: contain_more,
            font_size: font_size_more,
            font_color: font_color_more,
          },
        },
        // },

        {
          new: true,
        }
      );
    }

    // console.log("WebAdminUser", WebAdminUser);
    res.status(200).json({
      success: true,
      AppStatusUpdated,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};
