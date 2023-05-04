import mongoose from "mongoose";

const costSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    cost: {
      type: Number,
      default: 0,
      maxLength: [8, "cost can not exceed 8 charcter"],
    },
    transaction_type: {
      type: String,
      default: "price",
      required: true,
      enum: ["price", "barter"],
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

const Cost = mongoose.model("Cost", costSchema);
export default Cost;
