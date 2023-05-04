import errors from "../utils/errors.js";
import Campaign from "../models/companingModel.js";

// //@Router router.route("/userproduct").post(createProduct);
// //user wise product display
export const getcampaignProduct = async (req, res, next) => {
  try {
    const { userId }=req.body
    let campaign = await Campaign.find({user_id:userId}).populate({path:"product"}).sort({createdAt: "descending"});
    // campaign = campaign.filter((e)=>{ 
    //     console.log(e ,e?.product?.user_id,mongoose.Types.ObjectId(userId),e?.product?.user_id == mongoose.Types.ObjectId(userId),JSON.stringify(e?.product?.user_id),userId )
    //       if (JSON.stringify(e?.product?.user_id) == JSON.stringify(userId)){
    //           return e
    //       } 
    //   })

    res.status(200).json({
      success: true,
      campaign,
    });

  } catch (error) {
    console.log("error",error)
    return (res.status(500).json(errors.SERVER_ERROR))
  }
};

//@Router router.route("/newproduct").get(getAllstatus);
// product create 
export const createCampaign = async (req, res, next) => {
  try {
    const {product_id,campaign_title,campaign_price,campaign_duration} = req.body;

    if (!campaign_title) {
      return res.status(400).json({
        success: false,
        msg: "Please Enter status Name ",
      });
    }
      const cmpData = await Campaign.create({
        product:product_id,
        user_id:req.user.id,
        campaign_title, 
        campaign_price,
        campaign_duration
      });

      const campaign = await Campaign.find().populate({path:"product"}).sort({createdAt: "descending"});

      return res.status(201).json({
        success: true,
        campaign
      });
  } catch (error) {
    console.log("error",error)
    return (res.status(500).json(errors.SERVER_ERROR))
  }
};