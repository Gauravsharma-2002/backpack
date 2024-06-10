import { Router } from "express";
import healthcheckHandler from "../controller/healtcheckHandler.controller.js";
import { verifyJWT } from "../middelwares/auth.middleware.js";

const router = Router();
router.route("/").get(verifyJWT,healthcheckHandler);

export default router;
