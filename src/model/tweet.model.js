import Mongoose, { Schema } from "mongoose";

const tweetSchema = new Mongoose.Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    content: {
      type: String,
      lowercase: true,
      required: true
    }
  },
  { timestamps: true }
);

export const Tweet = Mongoose.model("Tweet", tweetSchema);
