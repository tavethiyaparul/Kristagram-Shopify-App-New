import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    user_id:{
      type: mongoose.Schema.ObjectId,
      ref: "User"
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "product"
    },
    campaign_title: {
      type: String,
    },
    campaign_price: {
        type: Number,
      },
    campaign_duration: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
)
// module.exports = mongoose.model("campaign", campaignSchema);

const campaign = mongoose.model("campaign", campaignSchema);
export default campaign;
