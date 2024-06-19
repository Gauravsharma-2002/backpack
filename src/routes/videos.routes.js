import { Router } from "express";
import { publishVideo } from "../controller/videos.controller.js";
import { verifyJWT } from "../middelwares/auth.middleware.js";
import { upload } from "../middelwares/multer.middelware.js";

const videosRouter = Router();

// secured Routes
videosRouter
  .route("/publish")
  .post(
    verifyJWT,
    upload.fields([{ name: "video" }, { name: "thumbnail" }]),
    publishVideo
  );

export default videosRouter;
