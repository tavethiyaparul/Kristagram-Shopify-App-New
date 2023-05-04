import mongoose from "mongoose";

const fraudContent = new mongoose.Schema(
  {
    // user_id: {
    //   type: mongoose.Schema.ObjectId,
    //   required: true,
    // },
    content: {
      type: String,
    },
    status: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const FraudContent = mongoose.model("FraudContent", fraudContent);
export default FraudContent;
