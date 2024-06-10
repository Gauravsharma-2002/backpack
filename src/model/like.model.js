import Mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const likeSchema = new Mongoose.Schema(
  {
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "Videos"
    },
    likedBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    tweet: {
      type: Schema.Types.ObjectId,
      ref: "Tweet"
    }
  },
  { timestamps: true }
);
likeSchema.plugin(mongooseAggregatePaginate);
export const Like = Mongoose.model("Like", likeSchema);
