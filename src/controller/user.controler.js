import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/errors.js";
import { User } from "../model/user.model.js";
import { upload } from "../middelwares/multer.middelware.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
  return res.status(200).json({
    message: "ok",
  });

  // now its time to make register function
  // steps
  // 1.take data from user/frontend/postman
  // 2.validation - Not empty
  // 3.check if user already exist : userName , email check kar ke
  // 4.check if avtar is given or not
  // 5. upload to cloudinary and check for its response
  // 6. create object and create entry in database
  // 7. remove password and refresh token
  // 8. check for user creation
  // 9. return response

  const { userName, email, fullname, password } = req.body;
  if ([userName, email, fullname, password].some((ele) => ele?.trim === "")) {
    throw new apiError(400, "required feild needed to be filled");
  }
  //   check if user already exist
  const existedUser = await User.findOne({
    $or: [{ email }, { userName }],
  });

  if (existedUser) {
    throw new apiError(409, "a user with same email or useName exist");
  }
  // check the path for avatar and coverimage

  const avtarPath = req.files?.avtar[0]?.path;
  const coverImagePath = req.files?.coverImage[0]?.path;

  if (!avtarPath) {
    throw new apiError(400, "avtar is mendetory");
  }
  //now have to upload on cloudinary
  const cloudIResAvtar = await uploadOnCloudinary(avtarPath);
  const cloudIResCoverImage = await uploadOnCloudinary(coverImagePath);

  //check if file is uploaded at server or not
  if (!cloudIResAvtar) {
    throw new apiError(400, "teri gaand pe marunga bsdk photo de mc");
  }

  //now time to make entry in database
  const dbResponse = await User.create({
    userName: userName.toLowerCase(),
    email,
    password,
    fullname,
    avtar: cloudIResAvtar.url,
    coverImage: cloudIResAvtar?.url || "",
  });

  const isUserCreated = await User.findById(dbResponse._id).select(
    "-password -refreshToken"
  );
  //now check if userCreated
  if (!isUserCreated) {
    throw new apiError(
      500,
      "something happened wrong while registering user please try again"
    );
  }

  //   now we have to send response in accordance for registration
  return res
    .status(202)
    .json(new ApiResponse(200, "user registered successfully", isUserCreated));
});

export const loginUser = asyncHandler(async (req, res) => {
  return res.status(200).json({
    message: "ok login",
  });
});
//now go and call this function when particular route is hit in router section

export { registerUser };
