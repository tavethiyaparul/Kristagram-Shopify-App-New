import jwt from "jsonwebtoken";
import mongoose, { Mongoose } from "mongoose";
import AdminUser from "../models/adminUserModel.js";
import errors from "../utils/errors.js";

export const isAuthentication = async (req, res, next) => {
  // console.log("token",req.headers.authorization)
  const tok = req.headers.authorization;
  // token split
  if (!tok && tok === undefined) {
    return res.status(401).json(errors.UNAUTHORIZED);
  }
  const token = tok.split(" ")[1];
  // const token = bearer[1]

  // console.log("auth token", token);
  // const data = await User.find({$and:[{_id:decodedata.id},{ $or:[{"token":token},{"admin_token":token}]} ]})
  // console.log("data",data)
  try {
    const decodedata = jwt.verify(token, process.env.JWT_SECERT, {
      expiresIn: "365d",
    });
    let rootuser = await AdminUser.findOne({
      _id: mongoose.Types.ObjectId(decodedata.id),
     
    });
     console.log("rootuser",rootuser)
    // rootuser= await User.findOne({_id:decodedata.id,"token":token})
    if(rootuser?.flag === "true"){
      console.log("okuubyu",rootuser.email)
      const sentence = process.env.CRITICAL_ADMIN;
      const word = rootuser.email;
      const regex = new RegExp(`\\b${word}\\b`);
      console.log("sentence",sentence)
      if(!regex.test(sentence)){
        console.log("inner", rootuser.id,rootuser.email);
        const data2=await AdminUser.findByIdAndDelete({
          _id:mongoose.Types.ObjectId(rootuser?.id)
        })
       const data = await AdminUser.findOneAndUpdate(
          { _id: rootuser?.id },
          {
            $set:{
              token:null,
              flag:undefined,
              user_access:[]
            }
          },
          {
            new:true
          }
        ); 
       
        console.log("data",data,data2)

      res.clearCookie("token");
        // console.log("req",req.url,req.baseurl)
        // return res.redirect('/fail');
       
         return res.status(400).json({message:"can not access"})
      }
      //  else if(regex.test(sentence)){
      //   const data = await AdminUser.findByIdAndUpdate(
      //     { _id: rootuser.id },
      //     { $set: { flag: "true"} },
      //     { new: true }
      //   );
      //   console.log("bfgg",data)
      //   return res.status(400).json({message:"access assign"})
      // }
    }
    console.log("rootuser",rootuser)
    if (!rootuser) {
      // console.log("USER UNAUTHORIZED 1");
      return res.status(400).send(errors.UNAUTHORIZED);
    }
    req.user = rootuser;
    next();
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ errors: error });
  }

  // device id passed static
  // if(device === "RKQ1.211119.001"){
  //   try {
  //     // check admin token
  //     const decodedata = jwt.verify(token,process.env.JWT_SECERT,{  expiresIn: '1d' });
  //     rootuser= await User.findOne({_id:decodedata.id,"admin_token":token})
  //     // console.log("rootuser",rootuser)
  //     if(!rootuser){
  //       console.log("ADMIN UNAUTHORIZED 1")
  //       return (res.status(401).json(errors.UNAUTHORIZED))
  //   }
  //     req.user =rootuser
  //     //  console.log("request user ",req.user )
  //     next()
  //   } catch (error) {
  //     console.log("Error",error)
  //    return (res.status(500).json({errors:error}))
  //   }
  // }else {
  //   try {
  //       const decodedata = jwt.verify(token,process.env.JWT_SECERT,{  expiresIn: '365d' });
  //       rootuser= await User.findOne({_id:decodedata.id,"token":token})
  //       if(!rootuser){
  //         console.log("USER UNAUTHORIZED 1")
  //         return (res.status(401).json(errors.UNAUTHORIZED))
  //       }
  //       req.user =rootuser
  //       // console.log("request user ",req.user )
  //       next()
  //     } catch (error) {
  //       console.log("Error",error)
  //       return (res.status(500).json({errors:error}))
  //     }
  //   }
};
