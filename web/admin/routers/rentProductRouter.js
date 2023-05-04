// const multer = require('multer')
// const multerS3 = require('multer-s3')
// const aws = require('aws-sdk')

import express from "express";
import { createRentProduct, deleteRentproduct, getAllRentProduct, RentAvaliable } from "../controllers/rentProductController.js";
const router = express.Router();
import {isAuthentication} from "../middleware/auth.js";

// aws.config.update({
//   secretAccessKey:process.env.AWS_S3_SECRET_ACCESS_KEY ,
//   accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
//   region: process.env.AWS_S3_REGION
// });

// const  s3 = new aws.S3()

// //multiple image set 
// const upload = multer({
//   storage: multerS3({
//       s3: s3,
//       bucket: process.env.AWS_S3_BUCKET_NAME,
//       acl: 'public-read',
//       contentType: multerS3.AUTO_CONTENT_TYPE,
//       key: function (req, file, cb) {
//           console.log("file",file);
//           cb(null,`secure/kristagram/${req.user.id}/rent_product_${new Date().getTime()}.jpg`); //use Date.now() for unique file keys
//       }
//   })
// });

// get all rent product
router.route("/allrentproduct").get(getAllRentProduct);

// create rent product 
// router.route("/newrentproduct").post(isAuthentication,upload.array('rent_product_image', 5),createRentProduct);

// delete rent product id wise
router.route("/deleterentproduct/:id").delete(deleteRentproduct);

// create rent product 
router.route("/editrentproduct").post(isAuthentication,RentAvaliable);

export default router;