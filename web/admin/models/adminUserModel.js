import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
  googleId: String,
  email: String,
  name: String,
  flag: {
    type: String,
    default: "false",
  },
  user_access: {
    type: Array,
  },
  token: {
    type: String,
  },
} ,{
  timestamps: true,
}
);

UserSchema.methods.getJWTToken = async function () {
  // console.log("pre save");
  const tokens = jwt.sign({ id: this._id }, process.env.JWT_SECERT);
  // {
  //   expiresIn: "356d",
  // }
  // console.log("tokens", tokens);
  this.token = tokens;
  await this.save();
  return tokens;
};

const AdminUser = mongoose.model("adminUser", UserSchema);

export default AdminUser;
