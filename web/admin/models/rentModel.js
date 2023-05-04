import mongoose from "mongoose";

const rentSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    rent_product_title: {
      type: String,
    },
    rent_product_image: {
      type: Array,
    },
    rent_product_price: {
      type: Number,
    },
    is_rent: {
      type: Boolean,
      default: false,
    },
    is_interested: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Rent = mongoose.model("rent", rentSchema);
export default Rent;