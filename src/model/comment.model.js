import Mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new Mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      lowercase: true
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "Videos"
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

commentSchema.plugin(mongooseAggregatePaginate);
export const Comment = Mongoose.model("Comment", commentSchema);
