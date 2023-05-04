import mongoose from "mongoose";

const spamReport = new mongoose.Schema(
  {
    spam_type_id: {
      type: mongoose.Schema.ObjectId,
      ref: "FraudContent",
    },
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    spam_user_id: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const SpamReport = mongoose.model("SpamReport", spamReport);
export default SpamReport;
