import { Router } from "express";
import {
  changePassword,
  getUserDetail,
  logoutUser,
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
route.route("/change-password").post(verifyJWT,changePassword)
route.route("/get-user").get(verifyJWT,getUserDetail)
route.route("/update-user").post(verifyJWT,userUpdateDetail)
route.route("/update-avatar").post(verifyJWT,upload.single('avatar'),updateAvatar)
route.route("/update-cover").post(verifyJWT,upload.single("coverimage"),updateCoverImage)

export default route;
