import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/errors.js";
import { User } from "../model/user.model.js";
// import { upload } from "../middelwares/multer.middelware.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
  //   // return res.status(200).json({
  //   //     message: "ok",
  //   //   });

  //   // now its time to make register function
  //   // steps
  //   // 1.take data from user/frontend/postman
  //   // 2.validation - Not empty
  //   // 3.check if user already exist : userName , email check kar ke
  //   // 4.check if avatartar is given or not
  //   // 5. upload to cloudinary and check for its response
  //   // 6. create object and create entry in database
  //   // 7. remove password and refresh token
  //   // 8. check for user creation
  //   // 9. return response

  

  const { fullname, email, password, userName } = req.body;
  console.log("82", fullname, email, password, userName);
  // const retrn = {
  //   fullname,
  //   email,
  //   password,
  //   userName,
  // };
  // apply validation here
  if ([fullname, email, password, userName].some((val) => val.trim() === "")) {
    throw new apiError(403, "feild shouldnot be empty");
  }

  const isUserExist = await User.findOne({
    $or: [{ email }, { userName }],
  });
  // console.log(isUserExist)
  if (isUserExist) {
    throw new apiError(402, "already registered");
  }
  // console.log("is here")
  const avatarFilePath = req.files?.avatar[0]?.path; // POTENTIAL BUG as if we dont upload a file we get execution halt here instead of thorwing error
  // console.log("is this too")
  const coverImageFilePath = req.files?.coverimage[0]?.path;
  // console.log(avatarFilePath)
  // console.log([avatarFilePath,coverImageFilePath])

  // console.log(req.files)
  //now check if the avatar file is there or not
  if (!avatarFilePath) {
    throw new apiError(402, "avatar file is required so upload it ");
  }
  //now we have the local file path so upload it on cloudinary
  const avatar = await uploadOnCloudinary(avatarFilePath);
  const coverimage = await uploadOnCloudinary(coverImageFilePath);
  // console.log([avatar,coverimage]); //<-- is here giving null
  if (!avatar) {
    throw new apiError(402, "add the avatar");
  }

  const userDB = await User.create({
    fullname,
    email,
    password,
    userName: userName.toLowerCase(),
    avatar: avatar.url,
    coverimage: coverimage?.url || "",
  });
  // console.log("userDB",userDB)
  const createdUser = await User.findById(userDB._id).select(
    "-password -refreshToken"
  );
  if (!userDB) {
    throw new apiError(501, "internal server error please register again");
  }

  return res.status(200).json(new ApiResponse(202, "user Details", createdUser));
});

//now go and call this function when particular route is hit in router section

export { registerUser };
