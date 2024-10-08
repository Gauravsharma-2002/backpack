import { Router } from "express";
import { verifyJWT } from "../middelwares/auth.middleware.js";
import { createPlaylist } from "../controller/playlist.controller.js";

const playlistRouter = Router();
//because playlist section requires user to be logged in access any playlist Route
playlistRouter.use(verifyJWT);
//verified Routes only registered user can access its created playlist
playlistRouter.route("/").get(createPlaylist).post(createPlaylist);

export default playlistRouter;
