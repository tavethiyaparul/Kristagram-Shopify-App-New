import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    review_by:{
      type: mongoose.Schema.ObjectId,
      ref: "User"
    },
    review_to:{
        type: mongoose.Schema.ObjectId,
        ref: "User"
      },
    review_comment: {
      type: String,
      trim:true
    },
    review_rating: {
        type: Number,
        trim:true
        },
    is_published: {
        type: Boolean,
        default:false,
        trim:true
      },
    is_review_done: {
      type:  Boolean,
      default:false,
      trim:true
    },
    publish_date: {
        type: String,
        trim:true
    },
    post_as_user: {
        type: String,
        trim:true
      },
    complited_pair:{
        type: mongoose.Schema.ObjectId,
        ref: "review"
      },
  },
  {
    timestamps: true,
  }
)

const review = mongoose.model("review", reviewSchema);
export default review;