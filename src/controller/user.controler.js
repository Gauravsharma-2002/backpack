import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/errors.js";
import { User } from "../model/user.model.js";
// import { upload } from "../middelwares/multer.middelware.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
// generating refreshToken access token
// const generateRefreshAndAccessToken = async function (userId) {
//   //garbarr ho sakti hai
//   try {
//     const user = await User.findById(userId);
//     //dekho yaha tumhe data aa gaya launde ka
//     //ab kya karo generate kar do
//     const accessToken = await user.createAccessToken();
//     const refreshToken = await user.createRefreshToken();
//     //ab generate ho gaya hai ab ise save kar do db me
//     //  dekho aise
//     user.refreshToken = refreshToken;
//     await user.save({ validateBeforeSave: false }); //default kya hoga jab tum kuch feild ko update karoge to us wqat sare feild ke validation kickin ho jaienge aur error maar denge to validateBeforeSave ko false kar do

//     return { accessToken, refreshToken };
//   } catch (error) {
//     throw new apiError(
//       504,
//       "internal Server Error while generating Refresh Token and Access token"
//     );
//   }
// };

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
  // console.log("82", fullname, email, password, userName);
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

  return res
    .status(200)
    .json(new ApiResponse(202, "user Details", createdUser));
});

//now go and call this function when particular route is hit in router section

// loginUser
//  req body se userId email passward
//  find karne ka
// passward check karne ka
// access refresh token generate  karne ka
// send via cookois

// const userLogin = asyncHandler(async (req, res) => {
//   const { email, userName, password } = req.body;
//   //  check karo ki kya hai if not maro sale ko
//   if (!userName && !email) {
//     throw new apiError(400, "email ya userName lagega");
//   }
//   //check karo register hai ki ni ,ni to sunao sale ko
//   const isUser = await User.findOne({
//     $or: [{ userName }, { email }],
//   });
//   if (!isUser) {
//     throw new apiError(400, "marenge sale ja ke register karo pahle");
//   }
//   // password verify karne ka
//   // yaha dekho jo isUser hai na vo ek objecjt hai db se aya hau matlab isme jo bhi user ke lie method define kare the sab hai
//   // to use karo unhe
//   const passwardCorrectHaiKya = await isUser.isPasswordCorrect(password);
//   if (!passwardCorrectHaiKya) {
//     throw new apiError(405, "marenge 10 ginenge 1 sahi password do bsdk");
//   }
//   //mano ki sahi nikal gaya passward tab kya karoge
//   // tab refresh token generate karna
//   // suno kya karo na ek functiono hi likh lo genereate karne ke lie
//   const { accessToken, refreshToken } = await generateRefreshAndAccessToken(
//     isUser._id
//   );
//   //dekho ab tumhare pass hai 2 options
//   // pahla ki tum upar wael object{isUser} hai usi ko update kar do ya fir ek aur db call mar do
//   // mai marunga as per regular copyMaster schema /db call
//   const loggedInUser = await User.findById(isUser._id).select(
//     "-password -refreshToken"
//   );

//   //dekho babu itna kar lia ab ye karo ki inhe cookies me bhejo
//   //  use se pahle ye samjho ki cookies ke sath kuch aur bhi jata hai
//   //  jise kahte hai options
//   // ye jo Options hai vo help karte hai apne cookies ko secure karne me
//   //  kuch aise ke inhe front end se modify kara ja sakta hai par apne ko aisa hone ni deba
//   const option = {
//     httpOnly: true,
//     secure: true,
//   };

//   //  ab apne ko user ko response bhejne ka
//   //  respone me use loggin kara dena hai
//   return res
//     .status(200)
//     .cookie("accessToken", accessToken, option)
//     .cookie("refreshToken", refreshToken, option)
//     .json(
//       new ApiResponse(
//         202,
//         {
//           user: loggedInUser,
//           accessToken,
//           refreshToken,
//         },
//         `${isUser.fullname} is loggedIN `
//       )
//     );
//   // kara dia tune logged in
//   // ab logout kara
//   // dekh teri lagegi
// });

const generateRefreshAndAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    //
    const accessToken = await user.createAccessToken();
    const refreshToken = await user.createRefreshToken();

    user.refreshToken = refreshToken;
    user.save({
      validateBeforeSave: false,
    });
    // console.log(accessToken, refreshToken);
    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(
      502,
      "something went wrong while creating refresh or access token"
    );
  }
};
const userLogin = asyncHandler(async (req, res) => {
  const { email, password, userName } = req.body;

  if (!(email || userName)) {
    throw new apiError(402, "kindly provide either email or userName");
  }
  const user = await User.findOne({
    $or: [{ email }, { userName }],
  });
  if (!user) {
    throw new apiError(402, "error while fetching data from db");
  }

  const isCorrectPassword = await user.isPasswordCorrect(password);
  // console.log(isCorrectPassword);
  if (!isCorrectPassword) {
    throw new apiError(403, "wrong password");
  }
  // console.log(user._id)
  const { accessToken, refreshToken } = await generateRefreshAndAccessToken(
    user._id
  );
  // console.log("line",{ accessToken, refreshToken });
  if (!(accessToken && refreshToken)) {
    throw new apiError(
      401,
      "something goes wrong while generating access or refresh Token"
    );
  }

  user.refreshToken = refreshToken;
  user.save({ validateBeforeSave: false });

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!loggedInUser) {
    throw new apiError(402, "something went wrong while logging you in ");
  }

  const option = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new ApiResponse(
        202,
        " kaise  -> maan gaya + user logged in successfully  ",
        { user: loggedInUser, refreshToken, accessToken }
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const userInfo = await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );
  // console.log("loggin userInfo",userInfo);
  const option = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", "", option)
    .cookie("refreshToken", "", option)
    .json(new ApiResponse(202, "user logged out succesfully ", {}));
});

// const logoutUser = asyncHandler(async (req, res) => {
//   // dekh tu aise kaise logout karaiega
//   // tujhe chaie rahiga user kar cookie ko clear karne ka
//   //  try kar hoga ni ku ki tere pass na id ha na email jaise logut ke lie chahie tha
//   // to kya karega user se logut karne ke lie form bhariyega
//   // abe ni bhai middleWare use karne ka idhar
//   // pahle design kar le ek baar use kaam ho jaiega tera
//   // usme tujhe chaiye rahega user ko verify karane ka

//   //ab tak tu req me user object add kar chuka hoaga
//   //ab use use kar aur user ka refresh token ura db se aur logout maar sale ko \

//   // req.user._id
//   await User.findByIdAndUpdate(
//     req.user._id,
//     {
//       $set: {
//         refreshToken: undefined,
//       },
//     }, //itna kar ke chor dia na to tujhe iske response me jo aya aur tune use kahi use karna hai to vo unupdated aiega
//     //jo value db me pahle thi vahi vali jisme refreshToken para hoga
//     //  to ussese deal karne ke lie kya karo ki agli wali feild add kar do
//     {
//       new: true,
//     }
//   );
//   // dekho ab tumhe refreshToken to uda dia db se
//   // cookies ko bhi uda do
//   // aur dhayan rakhna oprions ka
//   const option = {
//     httpOnly: true,
//     secure: true,
//   };

//   return req
//     .status(200)
//     .clearCookie("accessToken", option)
//     .clearCookie("refreshToken", option)
//     .json(new ApiResponse(200, {}, "logged out successfully"));
// });

// glitch only work when user is logged in
// can YOU MAKE ONE TO IF USER IS NOT LOGGED IN
const changePassword = asyncHandler(async (req, res) => {
  // console.log("inside Change password")
  const { oldPassword, newPassword } = req.body;
  // verify the old password in db
  // update the password
  // update that in db
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new apiError(402, "no such user exists");
  }
  const isCorrectPassword = await user.isPasswordCorrect(oldPassword);
  // console.log(isCorrectPassword)
  if (!isCorrectPassword) {
    throw new apiError(402, "wrong old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(202, "password updated sucessfully", {}));
});

// return user if logged in
const getUserDetail = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -refreshToken"
  );
  if (!user) {
    throw new apiError(402, "no such user exist");
  }

  return res
    .status(201)
    .json(new ApiResponse(202, "user fetched sucessfully", user));
});

const userUpdateDetail = asyncHandler(async (req, res) => {
  const { fullname, email } = req.body;

  //offcourse only logged in user can update these details

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { fullname, email },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");
  if (!user) {
    throw new apiError(
      402,
      "something went wrong while updating , please try again"
    );
  }
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(202, "users detailes updated sucessfully", user));
});

const updateAvatar = asyncHandler(async (req, res) => {
  try {
    // console.log("inside avatar changer");

    const avatarFilePath = req.file?.path;
    // console.log(avatarFilePath);
    if (!avatarFilePath) {
      throw new apiError(402, "no file is obtained kindly upload a file");
    }
    const avatar = await uploadOnCloudinary(avatarFilePath);
    if (!avatar) {
      throw new apiError(
        502,
        "something went wrong while uploading the file kindly upload it again "
      );
    }
    // console.log(avatar);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          avatar: avatar.url,
        },
      },
      { new: true }
    );
    if (!user) {
      throw new apiError(502, "something went wrong while updating avatar");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "avatar updated succesfully", user));
  } catch (error) {
    return res
      .status(404)
      .json(
        error.message ||
          new apiError(
            402,
            "something went wrong while updating avatar and in catch block"
          )
      );
  }
});
// const changePassword = asyncHandler(async (req, res) => {
//   //password change karne ke lie kya kya karna rahega
//   // old password le ke verify karna rahega
//   //fir new us model me new password set karna rahega
//   // fir use database me update kar dena rahega
//   // check kar lene ka ki hashed gaya ya ni
//   const { oldPassword, newPassword } = req.body;
//   // req.user._id
//   const user = await User.findById(req.user._id);
//   if (!user) {
//     throw new apiError(400, "no such user exist while changeing password");
//   }
//   // (user.password === oldPassword)
//   const isPassWordCorrect = await user.isPasswordCorrect(oldPassword);
//   if (!isPassWordCorrect) {
//     throw new apiError(401, "invalid wrong password");
//   }
//   user.password = newPassword;
//   await user.save({ validateBeforeSave: false });
//   return res
//     .status(200)
//     .json(new ApiResponse(201, "password updated succesfully", {}));
// });

// WRITE UPDATE DETAILS logic

// sun dekh Ye Yaad rakhne ka try kario ki jab bhi file change ke lie kere to septrate hi kario kuki network pe load kam rakhne ka hai apne ko
const updateCoverImage = asyncHandler(async (req, res) => {
  try {
    const coverImageFilePath = req.file?.path;
    if (!coverImageFilePath) {
      throw new apiError(402, "kindly upload a cover image");
    }
    const coverimage = await uploadOnCloudinary(coverImageFilePath);
    if (!coverimage) {
      throw new apiError(
        502,
        "something went wrong while uploading cover image"
      );
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          coverimage: coverimage.url,
        },
      },
      { new: true }
    ).select("-password -refreshToken");
    if (!user) {
      throw new apiError(
        503,
        "something wrong happened while uploading Yoyr cover image"
      );
    }

    return res
      .status(200)
      .json(new ApiResponse(202, "cover image updated succesfully", user));
  } catch (error) {
    throw new apiError(
      501,
      "cover image cannot be updated at this moment kindly try again after a cetrain time"
    );
  }
});
// refreshAccessToken
// to refreshAcessToken user must be logged and on hitting the refreshAccessToken end point new refresh and access token is generated
//and must have a refresh token
const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const inCommingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;
    if (!inCommingRefreshToken) {
      throw new apiError(402, "kindly send refreshToken");
    }
    // we know that the refreshToken is made by jwt and with only the _id as the data to be decoded
    const decodedToken = jwt.verify(
      inCommingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    if (!decodedToken) {
      throw new apiError(402, "no id is decoded from give refreshToken");
    }
    // pahle compare karo ki same hai ya ni
    const user = await User.findById(decodedToken._id);
    if (user?.refreshToken !== inCommingRefreshToken) {
      throw new apiError(404, "invalid refreshToken");
    }
    // now the decodedToken contains the id of particular account so generate accessToken and refreshToken corrosponding to them
    const { accessToken, newrefreshToken } =
      await generateRefreshAndAccessToken(decodedToken?._id);
    user.refreshToken = newrefreshToken;
    user.save({ validateBeforeSave: true });

    const option = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .cookie("accessToken", accessToken, option)
      .cookie("refreshToken", newrefreshToken, option)
      .json(
        new ApiResponse(202, "access token refreshed sucessfully", {
          accessToken,
          refreshToken: newrefreshToken,
        })
      );
  } catch (error) {
    throw new apiError(
      502,
      " something went wrong while refreshing acess token kindly try again after a momnet "
    );
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  //NOTE : params is an object

  const userName = req.params;
  // console.log(userName);
  // ALSO note this param object stores everything in form of key-value and VALUE IS ALWAYS STRING

  //

  if (userName?.trim) {
    throw new apiError(400, "missing user name");
  }

  const channel = await User.aggregate([
    {
      $match: { userName: userName?.toLowerCase },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },

    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscriberTo",
      },
    },
    // another pipeline which addes another feild to {User document }
    {
      $addFields: {
        subscriberCount: {
          $size: "$subscribers", // note here we are counting the number of documents to count the total subscribers ALSO here $ sign before "subscriber" indicates that it is a feidl and has to be used like this
        },
        subscribedToCount: {
          $size: "$subscriberTo",
        },
        isSubscriber: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] }, // NOTE : $in works on both array and the object and find the match in the given array or object{feild}
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullname: 1,
        subscribedToCount: 1,
        subscriberCount: 1,
        userName: 1,
        avatar: 1,
        coverimage: 1,
        isSubscriber: 1,
        email: 1,
      },
    },
    // you have added the required feilds to the document the next thing you have to do is to project it
  ]);

  // console.log("channel", channel); // as there is no such thing now so the channel would return the empty array for now But we would populate it soon

  // if (!channel?.length) {
  //   throw new apiError(404, "no channel exists !!! ");
  // }

  return res
    .status(200)
    .json(
      new ApiResponse(201, "channel fetched succesfully ||||| ", channel[0])
    );
});

const getWatchHistory = asyncHandler(async (req, res) => {
  // NOTE : here when we do aggregation pipeline we need the id but the issue arises when we try to get the id from req.user._id { which should return the id }, BUT we get String here
  // point to be noted that, till now we dont get any trouble because the conversion were handeled by the mongooses it self
  // But while writting aggregation pipeline This fact must be taken care that aggregation pipeline didnot support moongose by itSelf you Need to explicitely add the required modifications
  // NOTE : the id of mongoDB is in form of ObjectId("dasjlkfgjaewlijflkj") something like this , and mongoose preprocess the and return the internal string only

  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    userName: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            //now to facilitate the structure of obtained feild of owner
            // have to method ARRAYELEMENTSAT or FIRST
            // here i am adding a feild to the Videos document instead that i am overWritting the owner feild
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);

  if (!user) {
    throw new apiError(402, "no watch history is obtained !!!!!! ");
  }
  return res
    .status(201)
    .json(
      new ApiResponse(
        202,
        "watched history fetched succesfully !!!!!",
        user[0].watchHistory
      )
    );
});

export {
  registerUser,
  userLogin,
  logoutUser,
  changePassword,
  getUserDetail,
  userUpdateDetail,
  updateAvatar,
  updateCoverImage,
  refreshAccessToken,
  getUserProfile,
  getWatchHistory,
};
