import mongoose from "mongoose";

const webAdminUserAccess = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    user_access: {
      type: Array,
    },
    is_critical:{
      type:Boolean
    }
  },
  {
    timestamps: true,
  }
);

const WebAdminUserAccess = mongoose.model("WebAdminUser", webAdminUserAccess);
export default WebAdminUserAccess;
