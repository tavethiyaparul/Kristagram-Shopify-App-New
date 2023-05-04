import mongoose from "mongoose";

const shopSchema = mongoose.Schema({
  shop: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  access_token: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  country_code: {
    type: String,
    trim: true,
    required: true,
  },
  country_name: {
    type: String,
    trim: true,
    required: true,
  },
  access_scope: {
    type: Array,
    trim: true,
    required: true,
  },
  timestamp: {
    type: Number,
    required: true,
  },
  domain: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    trim: true,
  },
  customer_email: {
    type: String,
    trim: true,
    required: true,
  },
  money_format: {
    type: String,
    trim: true,
    required: true,
  },
  app_status: {
    type: String,
    trim: true,
    default: "installed",
    required: true,
    enum: ["installed", "uninstalled"],
  },
  currency: {
    type: String,
    trim: true,
    required: true,
  },
  timezone: {
    type: String,
    trim: true,
    required: true,
  },
  address1: {
    type: String,
    trim: true,
  },
  address2: {
    type: String,
    trim: true,
  },
  zip: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  shop_owner: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Number,
    trim: true,
  },
  updatedAt: {
    type: Number,
    trim: true,
  },
},
{ timestamps: { currentTime: () => new Date().getTime() } }
);

const Shop = mongoose.model("shop", shopSchema);

export default Shop;