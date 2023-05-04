import mongoose from "mongoose";
const AppStatusSchema = new mongoose.Schema({
  forcefullyUpdate: String,
  iosVersion: String,
  androidVersion: String,
  location_radius:{
    type:Number
  },
  location_with_no_selection:{
    contain:String,
    font_size:Number,
    font_color:String
  },
  location_with_no_more_selected_result:{
    contain:String,
    font_size:Number,
    font_color:String
  },
  admin_id:[]
},{
  timestamps: true,
});

const AppStatus = mongoose.model("othersettings", AppStatusSchema);

export default AppStatus;