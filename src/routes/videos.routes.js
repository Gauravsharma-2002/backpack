import { Router } from "express";
import { publishVideo,getVideoById } from "../controller/videos.controller.js";
import { verifyJWT } from "../middelwares/auth.middleware.js";
import { upload } from "../middelwares/multer.middelware.js";

const videosRouter = Router();

videosRouter.route("/getvideo/:id").post(getVideoById)

// secured Routes
videosRouter
  .route("/publish")
  .post(
    verifyJWT,
    upload.fields([{ name: "video" }, { name: "thumbnail" }]),
    publishVideo
  );


export default videosRouter;
