import { Router } from "express";
import {
  publishVideo,
  getVideoById,
  updateVideo,
  togglePublishStatus,
  getAllVideos,
  deleteVideoByItsId
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
videosRouter
  .route("/updatevideo/:id")
  .patch(verifyJWT, upload.single("thumbnail"), updateVideo);
// 66730a08f499664356bf3b65
videosRouter.route("/delete-video/:id").delete(verifyJWT, deleteVideoByItsId);

// toggle publish status of the video
// this must contains the id of the video to be toggeled
videosRouter.route("/toggle/publish/:id").patch(verifyJWT, togglePublishStatus);
videosRouter.route("/").get(verifyJWT, getAllVideos);

export default videosRouter;
