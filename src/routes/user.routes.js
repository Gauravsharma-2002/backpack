import { Router } from "express";
import { registerUser } from "../controller/user.controler.js";
// import { loginUser } from "../controller/user.controler.js";
// import { upload } from "../middlewares/multer.middleware.js";
import { upload } from "../middelwares/multer.middelware.js";

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
// route.route("/login").post(loginUser);

export default route;
