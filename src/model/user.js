import Mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const UserSchema = new Mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      index: true, //use this if u know that is used to search alot ,using index optimise search -concept of database
    },
    email: {
      type: String,
      require: true,
      trim: true,
      unique: true,
      // index:true,
    },
    fullname: {
      type: String,
      required: true,
      // lowercase:true,
      trim: true,
    },
    avatar: {
      type: String, //cloudnary url
      required: true,
    },
    coverimage: {
      type: String,
      //not required handled by frontend guy
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Videos",
      },
    ],
    password: {
      type: String,
      required: [true, "password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);
//convert to hash password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  await bcrypt.hash(this.password, 9);
  next();
});
//check if iser entered correct password
UserSchema.methods.isPasswordCorrect = async function (password) {
  return bcrypt.compare(password, this.password);
};
UserSchema.methods.createAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_DURATION,
    }
  );
};
UserSchema.methods.createRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_DURATION,
    }
  );
};
export const User = Mongoose.model("User", UserSchema);
