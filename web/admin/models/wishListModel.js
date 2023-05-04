import mongoose from "mongoose";

const wishListSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "products",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    wish_list_category: {
      type: mongoose.Schema.ObjectId,
      ref: "wishlistcategories",
      required: true,
    },
    select_date: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Wishlist = mongoose.model("wishlist", wishListSchema);
export default Wishlist;
