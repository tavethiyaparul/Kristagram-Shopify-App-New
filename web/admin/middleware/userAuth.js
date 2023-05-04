// import jwt from "jsonwebtoken";
// import User from "../models/userModel.js";
// import errors from "../utils/errors.js";

// export const isAuthenticationUser = async (req, res, next) => {
//   console.log("token123",req.headers.authorization)
//   const tok = req.headers.authorization;
//   // token split
//   if (!tok && tok === undefined) {
//     return res.status(401).json(errors.UNAUTHORIZED);
//   }
//   const token = tok.split(" ")[1];
//   // const token = bearer[1]

//   console.log("auth token", token);
//   // const data = await User.find({$and:[{_id:decodedata.id},{ $or:[{"token":token},{"admin_token":token}]} ]})
//   // console.log("data",data)
//   try {
//     const decodedata = jwt.verify(token, process.env.JWT_SECERT_USER, {
//       expiresIn: "365d",
//     });
//     console.log("decodedata", decodedata);
//     let rootuser = await User.findOne({
//       _id: decodedata.id,
//       token: token,
//     },
//     );
//     //  console.log("rootuser",rootuser)
//     // rootuser= await User.findOne({_id:decodedata.id,"token":token})
//     console.log("rootuser", rootuser)
//     if (!rootuser) {
//       console.log("USER UNAUTHORIZED 1");
//       return res.status(401).json(errors.UNAUTHORIZED);
//     }
//     req.user = rootuser;
//     next();
//   } catch (error) {
//     console.log("Error", error);
//     return res.status(500).json({ errors: error });
//   }

//   // device id passed static
//   // if(device === "RKQ1.211119.001"){
//   //   try {
//   //     // check admin token
//   //     const decodedata = jwt.verify(token,process.env.JWT_SECERT,{  expiresIn: '1d' });
//   //     rootuser= await User.findOne({_id:decodedata.id,"admin_token":token})
//   //     // console.log("rootuser",rootuser)
//   //     if(!rootuser){
//   //       console.log("ADMIN UNAUTHORIZED 1")
//   //       return (res.status(401).json(errors.UNAUTHORIZED))
//   //   }
//   //     req.user =rootuser
//   //     //  console.log("request user ",req.user )
//   //     next()
//   //   } catch (error) {
//   //     console.log("Error",error)
//   //    return (res.status(500).json({errors:error}))
//   //   }
//   // }else {
//   //   try {
//   //       const decodedata = jwt.verify(token,process.env.JWT_SECERT,{  expiresIn: '365d' });
//   //       rootuser= await User.findOne({_id:decodedata.id,"token":token})
//   //       if(!rootuser){
//   //         console.log("USER UNAUTHORIZED 1")
//   //         return (res.status(401).json(errors.UNAUTHORIZED))
//   //       }
//   //       req.user =rootuser
//   //       // console.log("request user ",req.user )
//   //       next()
//   //     } catch (error) {
//   //       console.log("Error",error)
//   //       return (res.status(500).json({errors:error}))
//   //     }
//   //   }
// };
