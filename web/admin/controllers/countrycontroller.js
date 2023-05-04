import errors from "../utils/errors.js";
import country from "../models/countryModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";

// //@Router router.route("/userproduct").post(createProduct);
// //user wise product display
export const getAllCountry = async (req, res, next) => {
  try {
    const data = await country
      .find()
      .sort({ Country_Name: 1 });
    data.map((e) => {
      if (e.Country_Flag) {
        if (
          req.hostname == "localhost" 
        ) {
          e.Country_Flag =
            "https://milan-bhikadiya.s3-eu-west-1.amazonaws.com/" +
            e.Country_Flag;
        } else {
          e.Country_Flag = process.env.CDN_BASE_URL + e.Country_Flag;
        }
      }
    });
    res.status(200).json({
      success: true,
      country: data,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

export const updateAllCountry = async (req, res, next) => {
  try {
    // const data = await country.find({"Status":"active"}).sort({Country_Name:1})
    const { id, Country_Code, Currency_Symbol, Currency,Country_Flag ,
      Country_Name,Phone_code,Status,iso2,iso3} = req.body;
    console.log("req.body", req.body);
    console.log('asdfghjk',id)
    const user = await country.findOneAndUpdate(
      { _id:mongoose.Types.ObjectId(id)},
      {
        $set: {
          Country_Code:Country_Code,
          Currency_Symbol:Currency_Symbol,
          Currency:Currency,
          Status:Status
        },
      },
      {
        new: true,
      }
    );
    console.log("user", user);
    res.status(200).json({
      success: true,
       user,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};
