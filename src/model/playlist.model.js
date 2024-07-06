import Mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const playlistSchema = new Mongoose.Schema(
  {
    name: {
      type: String,
      lowercase: true,
      unique: true,
      required: true
    },
    description: {
      type: String,
      lowercase: true
    },
    videos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Videos"
      }
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);
playlistSchema.plugin(mongooseAggregatePaginate);
export const Playlist = Mongoose.model("Playlist", playlistSchema);
