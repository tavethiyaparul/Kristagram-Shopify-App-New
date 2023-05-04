import mongoose from "mongoose";
import FraudContent from "../models/fraudContentModel.js";
import SpamReport from "../models/spamReportModel.js";
import errors from "../utils/errors.js";
import User from "../models/userModel.js";
// get spam

export const getSpamReport = async (req, res) => {
  try {
    // const query = [
    //   {
    //     $group: {
    //       _id: "$spam_user_id",
    //       count: {
    //         $count: {},
    //       },
    //     },
    //   },
    // ];
    // const data = await SpamReport.aggregate(query);

    let spam = await SpamReport.find({}).sort({ createdAt: -1 });
    // .populate("user_id", "phone first_name last_name")
    // .populate("spam_user_id", "phone first_name last_name")
    // .populate("spam_type_id", "content").lean();

    // let spam = await SpamReport.find({}).distinct(
    //   "spam_user_id",
    //   function (error, ids) {
    //     User.find({ _id: { $in: ids } }, function (err, result) {
    //       console.log("resultt", result);
    //       return result
    //     });
    //   }
    // );
    // spam=JSON.parse(spam)

    //  spam.map((e)=>{
    //     console.log("e",e,"data",data.map((e)=>e._id))
    //     if(e.spam_user_id._id == data.map((it)=> it._id)){
    //       console.log("sdfg")
    //         // e.count=data.map((e)=>{return e})
    //   }})
    // for (const iterator of spam) {
    //   console.log("iterator",iterator)
    //   for (const e of data) {
    //     console.log("e",e)
    //     if(iterator.spam_user_id === e._id){
    //       console.log("hello",)
    //     }

    //   }

    // }

    return res.status(200).json({
      success: true,
      spam: spam,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

// get count data (inner spam report API)

export const getSpamReportCount = async (req, res) => {
  try {
    // console.log("req.query.spam_id", mongoose.Types.ObjectId(req.params.id));
    let spam = await SpamReport.find({
      // spam_user_id: mongoose.Types.ObjectId(req.params.id),
    }).sort({createdAt:-1})
      .populate("user_id", "phone first_name last_name country_code")
      .populate("spam_user_id", "phone first_name last_name country_code")
      .populate("spam_type_id", "content");
    spam=JSON.parse(JSON.stringify(spam))
    for (const item of spam) {
      if(item?.spam_user_id?._id){
      console.log("item.spam_user_id._id",item.spam_user_id._id)
      const data=await SpamReport.find({spam_user_id:item?.spam_user_id?._id})
      item.count=data.length
      console.log("item.count",item.count)}
    }

    return res.status(200).json({
      success: true,
      spam: spam,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

export const getSpamReportCount2 = async (req, res) => {
  try {
    console.log("req.query.spam_id", mongoose.Types.ObjectId(req.params.id));
    const spam = await SpamReport.find({
      spam_user_id: mongoose.Types.ObjectId(req.params.id),
    }).sort({createdAt:-1})
      .populate("user_id", "phone first_name last_name country_code")
      .populate("spam_user_id", "phone first_name last_name country_code")
      .populate("spam_type_id", "content");
    console.log("val", spam);

    return res.status(200).json({
      success: true,
      spam: spam,
      spamCount: spam.length,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

// get spam new
export const getSpamReportNew = async (req, res, next) => {
  try {
    // const spamdistinct = await spamreport.distinct('spam_user_id')
    // console.log("spamdistinct",spamdistinct)
    const data = await SpamReport.aggregate([
      { $group: { _id: "$spam_user_id", count: { $sum: 1 } } },
    ]);
    console.log("data", data);
    let spamReport = await User.find({ _id: { $in: data } }).sort({createdAt:-1});

    spamReport = JSON.parse(JSON.stringify(spamReport));

    //  const spam = await spamreport

    //  spamReport.map((e) => {
    //   if (data.includes(e._id)) {
    //     e.spamcount = data[0].count
    //     return e
    //   }
    // });

    for (let e of spamReport) {
      // for (let iterator of data) {
      if (data.includes(e._id)) {
        console.log("home");
        e.spamcount = data[0].count;
      }
      // }
    }

    //  spamReport.filter((e)=>{
    //   console.log("xcvbnm",e.spam_user_id.include(spamdistinct))
    //     return e.spam_user_id.include(spamdistinct)
    //  })

    return res.status(201).json({
      success: true,
      spamReport,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};
