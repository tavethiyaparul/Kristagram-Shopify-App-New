import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
user_id: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
    },
  name: {
    type: String,
  },
  product_image: {
    type: Array,
  },
 price: {
    type: Number,
  },

},{
    timestamps: true,
  })


const Product = mongoose.model("products", productSchema);
export default Product;