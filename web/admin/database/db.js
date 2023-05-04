import mongoose from "mongoose";

const connectDB = async () => {
  const URL = process.env.MONGO_URL;
  try {
    mongoose.connect(URL, { useUnifiedTopology: true, useNewUrlParser: true });
    console.log("Connected Successfully..");
  } catch (error) {
    console.log("error while connecting database", error);
  }
};

export default connectDB;
