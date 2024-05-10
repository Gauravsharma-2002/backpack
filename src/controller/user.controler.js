import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/errors.js";
import { User } from "../model/user.model.js";
// import { upload } from "../middelwares/multer.middelware.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateRefreshAndAccessToken = async function (userId) {
  //garbarr ho sakti hai
  try {
    const user = await User.findById(userId);
    //dekho yaha tumhe data aa gaya launde ka
    //ab kya karo generate kar do
    const accessToken = await user.createAccessToken();
    const refreshToken = await user.createRefreshToken();
    //ab generate ho gaya hai ab ise save kar do db me
    //  dekho aise
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); //default kya hoga jab tum kuch feild ko update karoge to us wqat sare feild ke validation kickin ho jaienge aur error maar denge to validateBeforeSave ko false kar do

    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(
      504,
      "internal Server Error while generating Refresh Token and Access token"
    );
  }
};

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

const userLogin = asyncHandler(async (req, res) => {
  const { email, userName, password } = req.body;
  //  check karo ki kya hai if not maro sale ko
  if (!email || !userName) {
    throw new apiError(400, "email ya userId lagega");
  }
  //check karo register hai ki ni ,ni to sunao sale ko
  const isUser = await User.findOne({
    $or: [{ userName }, { email }],
  });
  if (!isUser) {
    throw new apiError(400, "marenge sale ja ke register karo pahle");
  }
  // password verify karne ka
  // yaha dekho jo isUser hai na vo ek objecjt hai db se aya hau matlab isme jo bhi user ke lie method define kare the sab hai
  // to use karo unhe
  const passwardCorrectHaiKya = await isUser.isPasswordCorrect(isUser._id);
  if (!passwardCorrectHaiKya) {
    throw new apiError(405, "marenge 10 ginenge 1 sahi password do bsdk");
  }
  //mano ki sahi nikal gaya passward tab kya karoge
  // tab refresh token generate karna
  // suno kya karo na ek functiono hi likh lo genereate karne ke lie
  const { accessToken, refreshToken } = await generateRefreshAndAccessToken(
    isUser._id
  );
  //dekho ab tumhare pass hai 2 options
  // pahla ki tum upar wael object{isUser} hai usi ko update kar do ya fir ek aur db call mar do
  // mai marunga as per regular copyMaster schema /db call
  const loggedInUser = await User.findById(isUser._id).select(
    "-password -refreshToken"
  );

  //dekho babu itna kar lia ab ye karo ki inhe cookies me bhejo
  //  use se pahle ye samjho ki cookies ke sath kuch aur bhi jata hai
  //  jise kahte hai options
  // ye jo Options hai vo help karte hai apne cookies ko secure karne me
  //  kuch aise ke inhe front end se modify kara ja sakta hai par apne ko aisa hone ni deba
  const option = {
    httpOnly: true,
    secure: true,
  };

  //  ab apne ko user ko response bhejne ka
  //  respone me use loggin kara dena hai
  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new ApiResponse(
        202,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        `${isUser.fullname} is loggedIN `
      )
    );
    // kara dia tune logged in 
    // ab logout kara 
    // dekh teri lagegi 
});

const logoutUser = asyncHandler (async(req,res)=>{
  // dekh tu aise kaise logout karaiega
  // tujhe chaie rahiga user kar cookie ko clear karne ka 
  //  try kar hoga ni ku ki tere pass na id ha na email jaise logut ke lie chahie tha 
  // to kya karega user se logut karne ke lie form bhariyega 
  // abe ni bhai middleWare use karne ka idhar 
  // pahle design kar le ek baar use kaam ho jaiega tera
  

})

export { registerUser, userLogin };
