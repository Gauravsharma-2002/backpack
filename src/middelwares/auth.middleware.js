// import { User } from "../model/user.model.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { apiError } from "../utils/errors.js";
// import jwt from "jsonwebtoken"

// //ye wala middelware khali verify karega ki user hai ya ni hai

// export const verifyJWT = asyncHandler(async (req, res, next) => {
//   try {
//     // start karne ke lie ye dekh ki tu kaise access kar sakta hai user ko
//     // cookies ke through
//     // vo pata hai kaha milega
//     // tune jo app.use(cookieparser()) kiya tha us se hua ye ki teri cookies ka access req aur response ko mil gaya
//     // ab tune usi ko use karna hai

//     //to pahla step ki jis cookie ko access karna hai vo karo
//     //deho ho sakta hai ki vo cookie na bhi ho Or uski jagah par authToken ho jo ki mobile devise me as a header bheja jata hai
//     //to dono ko handle kar lena
//     //ye jo authoriztion wala maal hai na wo tumko postman me dekhne ko  mil jaiega
//     //vaha ye dekhna kuch aisa rahega ki jo auth token hai uski keY me "Authorization" likha hoga aur uske corrosponding value me "Bearer <Token>" diya rhaega
//     //tumko use bhi dekhna hai
//     const token =
//       req.cookies?.accessToken ||
//       req.header("Authorization")?.replace("Bearer ", "");
//     //agar ni hai maro sale ko
//     if(!token){
//       throw new apiError(400,"no token found")
//     }
//     //ab dekho agar token hai to pata karo ki us token me kya kya hia
//     // ye kon bataega bc , jisne token banaya hai
//     //the lord jwt

//     const decodedInfo = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
//     //ek baat samho iske sath ki token bas u hi khali pili to bana ni hai usem kuch data tha
//     //to us data me hamne ek user id bhi dii thi use ko use karna hai ab

//     //ab maro ek db query
//     const user =  await User.findById(decodedInfo._id)
//     //mila tumhe data jo chahie tha
//     // aur is data ka milna ye proof hai ki user logged in hai
//     //ab kya karo is use ko as a object add kar do apne req me
//     req.user = user; //ab tum ise use kar sakte ho

//     next() //jaha bhi age jana hai

//   } catch (error) {
//     throw new apiError(402,error.message ||" invalid access token")
//   }

// });
// //ban hi gaya tera middel ware
// //ab ja use kar
// // aur tere pahla use jo tu karega vo hoga user ko logout karana
// //to ja kara ab dekh kya raha hai

import { User } from "../model/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/errors.js";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    //access through cookies which ar acees tokn and refresh token
    // console.log("accessing cookies", req.cookies);
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    // console.log("accessing access token", accessToken);
    if (!accessToken) {
      throw new apiError(402, "no access or auth token exists  or user is not logged in");
    }
    // console.log(accessToken);
    // const decodeInfo = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const decodeInfo = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    if (!decodeInfo) {
      throw new apiError(402, "no such use Exist or invalid token or user is not logged in ");
    }

    const user = await User.findById(decodeInfo._id);
    if (!user) {
      throw new apiError(404, "user not found");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new apiError(
      402,
      error.message || "maa chuda ni error aya hai tere auth mid me "
    );
  }
});
export { verifyJWT };
