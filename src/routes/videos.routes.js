import { Router } from "express";
import {
  publishVideo,
  getVideoById,
  updateVideo
} from "../controller/videos.controller.js";
import { verifyJWT } from "../middelwares/auth.middleware.js";
import { upload } from "../middelwares/multer.middelware.js";

const videosRouter = Router();

videosRouter.route("/getvideo/:id").post(getVideoById);

// secured Routes
videosRouter
  .route("/publish")
  .post(
    verifyJWT,
    upload.fields([{ name: "video" }, { name: "thumbnail" }]),
    publishVideo
  );
videosRouter.route("/updatevideo/:id").patch(verifyJWT,upload.single("thumbnail") ,updateVideo);
// 66730a08f499664356bf3b65

export default videosRouter;
