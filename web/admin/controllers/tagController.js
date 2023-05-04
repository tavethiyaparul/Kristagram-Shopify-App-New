import Tag from "../models/tagModel.js";
import mongoose from "mongoose";
import errors from "../utils/errors.js";


//@Router router.route("/newtag").post(isAuthentication,createTag);
//create tag
export const createTag = async (req, res, next) => {
  try {
    // console.log('req.body',req.body)
    const { name,status } = req.body;
    let tName = name.toLowerCase();
    // const userId = req.user.id;

    // let status;
    // if (req.user.is_admin) {
      // status = "approved";

      if (!tName) {
        return res.status(400).json(errors.MANDATORY_FIELDS);
      }

      const tagName = await Tag.find({ name: tName });
      if (tagName != "") {
        return res.status(400).json({
          success: false,
          message: "Already exist tag name",
        });
      }

      const TagData = await Tag.create({
        name: tName,
        // user_id: userId,
        status,
      });

      // console.log("tag", tName);
      // const tags = await Tag.find();
      return res.status(201).json({
        success: true,
        tag: TagData,
      });
    // }
    //  else {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Admin User Access. ",
    //   });
    // }
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

//@routerrouter.route("/alltags").get(getAllTag);
//get All Tag
export const getAllTag = async (req, res, next) => {
  try {
    const user = req.query.userId;
    const status = req.query.status;
    const typeofuser = req.query.type_of_user;
    const name = req.query.name;
    const itemperpage = req.query.itemperpage || 100
    const currentpageno = req.query.currentpageno || 1;
    // if (Object.entries(req.query).length > 0) {
      let andQuery = [];
      if (user) {
        andQuery.push({ user_id: user });
      }
      if (status) {
        andQuery.push({ status });
      }
      if (name) {
        andQuery.push({ name: { $regex: "^" + name, $options: "i" } });
      }

      let arrData;
      if (andQuery.length > 0) {
        arrData = {
          $and: andQuery,
        };
      } else {
        arrData = {};
      }

      //     const query =[
      //       {
      //           '$match': {
      //               'name': 'ba',
      //               'status': 'pending'
      //           }
      //       }
      //   ]

      //   const queryuser =[
      //     {
      //         '$match': {
      //             'user_id.type_of_user': 'brand',
      //         }
      //     }
      // ]
      //   const data = Tag.aggregate(query)
      //   console.log("data",data)
      //   const data1 = Tag.populate(data,{path:"user_id",select:'type_of_user'})
      //   console.log("data",data1)

      let tags = await Tag.find(arrData)
        .populate({ path: "user_id", select: "type_of_user" })
        .limit(itemperpage)
        .skip(itemperpage * currentpageno - itemperpage);

      // typrofuser
      if (typeofuser) {
        tags = tags.filter((e) => {
          if (e?.user_id?.type_of_user === typeofuser) {
            return e;
          }
        });
      }
      let tagCount = await Tag.find().countDocuments()
      // console.log("tagcount",tagCount)
      return res.status(200).json({
        success: true,
        total_tag:tagCount,
        tag: tags,
       
      });
    // } else {
    //   return res.status(400).json({
    //     success: true,
    //     message: "Invalid request send.",
    //   });
    // }
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

//@Router router.route("/verifytag").put(verifyTag);
//verify admin tag api
export const verifyTag = async (req, res, next) => {
  try {
    // console.log('req',req.body)
    const { tagId, status } = req.body;
    let statusCase = status.toLowerCase();

    if (!tagId || !statusCase) {
      return res.status(400).json(errors.MANDATORY_FIELDS);
    }
    // if (req.user.is_admin === true) {
    //   const tag = await Tag.findById({ _id: tagId });
    //   if (!tag) {
    //     return res.status(400).json(errors.INVALID_FIELDS);
    //   }

      const tagData = await Tag.findByIdAndUpdate(
        tagId,
        { status: statusCase },
        {
          new: true,
          runValidators: true,
        }
      );
      // return res.status(201).json({
      //   success: true,
      //   tag: tagData,
      // });
      // const tags = await Tag.find();
      return res.status(201).json({
        success: true,
        tag: tagData,
      });
    // } 
    // else {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Admin User Access. ",
    //   });
    // }
  } catch (error) {
    console.log("error", error);
    if (error instanceof mongoose.Error.ValidationError) {
      for (let field in error.errors) {
        return res.status(500).json({
          success: false,
          message: error.errors[field].message,
        });
      }
    }
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

//@Router router.route("/userwisetag").get(isAuthentication,getTagUesrs);
// perticuler user create a tag
export const getTagUesrs = async (req, res, next) => {
  try {
    const tags = await Tag.find({ user_id: req.user.id });
    return res.status(200).json({
      success: true,
      tag: tags,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

//@Router router.route("/deletetag").delete(isAuthentication,deleteTag);
// delete all tag particuler user.
export const deleteTag = async (req, res, next) => {
  try {
    const userid = req.user.id;
    const tag = await Tag.deleteMany({ user_id: userid });
    const tags = await Tag.find({}).populate({
      path: "user_id",
      select: "type_of_user",
    });

    res.status(201).json({
      success: true,
      tag: tags,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

//@Router router.route("/deleteadmintag").delete(isAuthentication,deleteadminTag)
//particuler tag delete a admin user
export const deleteadminTag = async (req, res, next) => {
  try {
    console.log('reqqq',req.params)
    const { tagId } = req.params;

    if (!tagId) {
      return res.status(400).json(errors.MANDATORY_FIELDS);
    }

    // const adminId = req.user.is_admin;
    // if (adminId == true) {
      const tagdata = await Tag.findById({ _id: tagId });
      if (!tagdata) {
        return res.status(400).json(errors.INVALID_FIELDS);
      }
      const tag = await Tag.findByIdAndDelete({ _id: tagId });

      // let tags = await Tag.find({}).populate({
      //   path: "user_id",
      //   select: "type_of_user",
      // });

      return res.status(201).json({
        success: true,
         tag,
      });
    // } 
    // else {
    //   //admin false
    //   return res.status(400).json({
    //     success: false,
    //     message: "Admin User Access. ",
    //   });
    // }
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

//@Router router.route("/searchtag/:name").get(searchtag);
//search Tag
export const searchtag = async (req, res, next) => {
  try {
    const name = req.query.search;
    const statusData = req.query.status;
    const itemperpage = req.query.itemperpage || 1000000;
    const currentpageno = req.query.currentpageno || 1;

    let andQuery = [];
    if (name) {
      andQuery.push({ name: { $regex: "^" + name, $options: "i" } });
    }

    if (statusData) {
      andQuery.push({ status: statusData });
    }

    let arrData;
    if (andQuery.length > 0) {
      arrData = {
        $and: andQuery,
      };
    } else {
      arrData = {};
    }

    let tags = await Tag.find(arrData)
      .populate({ path: "user_id", select: "type_of_user" })
      .limit(itemperpage)
      .skip(itemperpage * currentpageno - itemperpage);

    return res.status(200).json({
      success: true,
      tag: tags,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};
