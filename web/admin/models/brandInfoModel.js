import mongoose from "mongoose";
// const validator = require("validator");

const brandSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    type_of_brand: {
      type: String,
      enum: ["online", "offline"],
    },
    store_website: {
      type: String,
    },
    business_name: {
      type: String,
    },
    country: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    tag: [
      {
        tagId: {
          type: mongoose.Schema.ObjectId,
          ref: "tag",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// module.exports = mongoose.model("brandinfo", brandSchema);
const brandinfo = mongoose.model("brandinfo", brandSchema);
export default brandinfo;
