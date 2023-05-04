import Rent from "../models/rentModel.js";
import errors from "../utils/errors.js";
import Country from "../models/countryModel.js";

//@Router router.route("/allrentproduct").post(getAllRentProduct);
// all product display
export const getAllRentProduct = async (req, res, next) => {
  try {
    console.log(" req.query.user_id", req.query.user_id);
    const itemperpage = req.query.itemperpage || 100;
    const currentpageno = req.query.currentpageno || 1;
    const customer = req.query.user_id;

    let andQuery = [];
    if (customer) {
      andQuery.push({ user_id: customer });
    }

    let arrData;
    if (andQuery.length > 0) {
      arrData = {
        $and: andQuery,
      };
    } else {
      arrData = {};
    }

    let rent = await Rent.find(arrData)
      .sort({ createdAt: "descending" })
      .populate({
        path: "user_id",
        select:
          "first_name last_name country state  city  pin_code profile_image phone country_code currency  ",
      })
      .limit(itemperpage)
      .skip(itemperpage * currentpageno - itemperpage)
      .sort({ createdAt: -1 })
      .lean();

    rent = JSON.parse(JSON.stringify(rent));

    if (rent.length <= 0) {
      return res.status(200).json({
        success: true,
        rent: [],
      });
    }

    //user_id not allow null
    rent =
      rent.length &&
      rent?.filter((e) => {
        return e.user_id != null;
      });

    for (var e of rent) {
      if (e.rent_product_image) {
        e.rent_product_image = e.rent_product_image.map(
          (e) => process.env.CDN_BASE_URL + e
        );
      }

      if (e?.user_id?.profile_image) {
        e.user_id.profile_image =
          process.env.CDN_BASE_URL + e?.user_id?.profile_image;
      }
      if (e?.user_id?.country) {
        let data = await Country.findOne({
          Country_Name: e?.user_id?.country,
        }).select("Country_Flag");
        data = JSON.parse(JSON.stringify(data));
        if (data) {
          e.user_id.country_flag =
            process.env.CDN_BASE_URL + data?.Country_Flag;
        }
      }

      e.user = e.user_id;
      delete e.user_id;
    }
    res.status(200).json({
      success: true,
      rent,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

//@Router router.route("/createrent").get(newrent);
//rent product create
export const createRentProduct = async (req, res, next) => {
  try {
    const { name, price, is_rent } = req.body;
    console.log("createRentProduct req.body", req.body);
    console.log("req", req.files);

    if (!name) {
      return res.status(400).json({
        success: false,
        msg: "Please Enter Title ",
      });
    }

    let arrimage = [];
    req.files.map((file) => {
      return arrimage.push(file.key);
    });
    console.log("arrimage", arrimage);

    const rentData = await Rent.create({
      user_id: req.user.id,
      rent_product_title: name,
      rent_product_price: price,
      rent_product_image: arrimage,
      is_rent,
    });

    let rent = await Rent.find({ user_id: req.user.id })
      .sort({ createdAt: "descending" })
      .populate({
        path: "user_id",
        select:
          "first_name last_name country state  city  pin_code profile_image phone country_code currency  ",
      });
    rent = JSON.parse(JSON.stringify(rent));
    for (var e of rent) {
      if (e.rent_product_image) {
        e.rent_product_image = e.rent_product_image.map(
          (e) => process.env.CDN_BASE_URL + e
        );
      }
      if (e?.user_id?.profile_image) {
        e.user_id.profile_image =
          process.env.CDN_BASE_URL + e?.user_id?.profile_image;
      }
      if (e?.user_id?.country) {
        let data = await Country.findOne({
          Country_Name: e?.user_id?.country,
        }).select("Country_Flag");
        data = JSON.parse(JSON.stringify(data));
        if (data) {
          e.user_id.country_flag =
            process.env.CDN_BASE_URL + data?.Country_Flag;
        }
        e.user = e.user_id;
        delete e.user_id;
      }
    }
    return res.status(201).json({
      success: true,
      rent,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

// @Router router.route("/deleterent/:id").get(deleteRentproduct);
// delete rent product
export const deleteRentproduct = async (req, res, next) => {
  try {
    console.log("req.body", req.params.id);
    const id = req.params.id;

    const rentdelete = await Rent.findByIdAndDelete({ _id: id });
    console.log("rentdelete", rentdelete);
    res.status(200).json({
      success: true,
      message: rentdelete
        ? "Rent product Delete Successfully"
        : "Rent product Not Deleted.",
    });

    // res.status(400).json({
    //   success: false,
    //   message: "Invalid User",
    // });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};

//@Router router.route("/createrent").get(newrent);
// product create
export const RentAvaliable = async (req, res, next) => {
  try {
    console.log("req.body", req.body);
    let rentData = await Rent.find({ user_id: req.user.id });
    let rent;
    if (rentData.length > 0) {
      await Rent.findByIdAndUpdate(
        { _id: req.body.id },
        { price: req.body.price, is_rent: req.body.is_rent },
        { new: true }
      );

      rent = await Rent.find({ user_id: req.user.id })
        .sort({ createdAt: "descending" })
        .populate({
          path: "user_id",
          select:
            "first_name last_name country state  city  pin_code profile_image phone country_code currency",
        });

      console.log("rent", rent);
      rent = JSON.parse(JSON.stringify(rent));
      for (var e of rent) {
        if (e.rent_product_image) {
          e.rent_product_image = e.rent_product_image.map(
            (e) => process.env.CDN_BASE_URL + e
          );
        }
        if (e?.user_id?.profile_image) {
          e.user_id.profile_image =
            process.env.CDN_BASE_URL + e?.user_id?.profile_image;
        }
        if (e?.user_id?.country) {
          let data = await Country.findOne({
            Country_Name: e?.user_id?.country,
          }).select("Country_Flag");
          data = JSON.parse(JSON.stringify(data));
          if (data) {
            e.user_id.country_flag =
              process.env.CDN_BASE_URL + data?.Country_Flag;
          }
          e.user = e.user_id;
          delete e.user_id;
        }
      }

      return res.status(201).json({
        success: true,
        rent,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid User",
      });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(errors.SERVER_ERROR);
  }
};
