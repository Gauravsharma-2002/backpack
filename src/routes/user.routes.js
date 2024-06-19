import { Router } from "express";
import {
  changePassword,
  getUserDetail,
  getUserProfile,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAvatar,
  updateCoverImage,
  userLogin,
  userUpdateDetail,
} from "../controller/user.controler.js";
// import { loginUser } from "../controller/user.controler.js";
// import { upload } from "../middlewares/multer.middleware.js";
// import { logoutUser } from "../controller/user.controler.js";
import { upload } from "../middelwares/multer.middelware.js";
import { verifyJWT } from "../middelwares/auth.middleware.js";

const route = Router();
// now here define the route which you want to hit

// on getting control of certain post fix particular controller is called for example below is resister we call register user and for /login we call loginUser
route.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverimage", maxCount: 1 },
  ]),
  registerUser
); // means when we hit the route in app.js
route.route("/login").post(upload.any(), userLogin);

//secured routes
route.route("/logout").post(verifyJWT, logoutUser);
route.route("/change-password").post(verifyJWT, changePassword);
route.route("/get-user").get(verifyJWT, getUserDetail);
route.route("/update-user").patch(verifyJWT, userUpdateDetail);
route
  .route("/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateAvatar);
route
  .route("/update-cover")
  .patch(verifyJWT, upload.single("coverimage"), updateCoverImage);
route.route("/refreshAccessToken").post(verifyJWT, refreshAccessToken);
// To make a route parameter optional just add the question mark after the route parameter
// example route.route("/c/:id?")
//  ALSO note that query parameter and path variable are two differenet things
// query parameter is not part of path varaible it is extension to it to optimise the search result
// example route.route("/c/movie?limit=5") here this limit guy is the query parameter
//NOTE we have another guy named QUERY something similiar to the params it is also an object i guess

route.route("/get-profile/:userName").get(verifyJWT, getUserProfile);

export default route;
