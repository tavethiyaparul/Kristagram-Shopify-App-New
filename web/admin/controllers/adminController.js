import AdminUser from "../models/adminUserModel.js";
import errors from "../utils/errors.js";

export const getUsers = async (req, res) => {
  try {
    const users = await AdminUser.find({});
    return res.status(200).json({
      success: true,
      users: users,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

export const getUserDetails = async (req, res) => {
  try {
    // console.log("user data 1",req.user,req.user.email)
    const users = await AdminUser.findById({ _id: req.user._id });
    return res.status(200).json({
      success: true,
      users:users,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

export const adminTokenCheck = async (req, res) => {
  try {
    // console.log("user data 1",req.user,req.user.email)
    const {token}=req.body
    console.log("token",token);
    const users = await AdminUser.findOne({token:token});
    console.log("users",users);
    return res.status(200).json({
      success: true,
      users:users,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

// export const logout = async (req, res, next) => {
//   try {
//     const userId = req.user.id;
//     const token = null;
//     data = await User.findByIdAndUpdate(
//       { _id: userId },
//       { $set: { token: token } },
//       {
//         new: true,
//       }
//     );
//     res.status(200).json({
//       success: true,
//       message: "loged out ",
//     });
//   } catch (error) {
//     console.log("error", error);
//     return res.status(500).json(errors.SERVER_ERROR);
//   }
// };