import mongoose from "mongoose";
const wishListSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      trim: true,
    },
    status: {
      type: Boolean,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Wishlistcategories = mongoose.model("wishlistcategories", wishListSchema);
export default Wishlistcategories;
