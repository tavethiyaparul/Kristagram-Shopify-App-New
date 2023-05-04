import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: false,
    },
    name: {
      type: String,
      required: [true, "Please Enter Your tag Name"],
      unique: true,
    },
    status: {
      type: String,
      default: "pending",
      required: true,
      enum: ["pending", "suspended", "approved"],
    },
  },
  {
    timestamps: true,
  }
);

const Tag = mongoose.model("tag", tagSchema);

export default Tag;
