import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { apiError } from "../utils/errors.js";

const healthcheckHandler = asyncHandler(async (req, res) => {
  try {
    //   console.log("working in healthCheck handler");

    return res
      .status(200)
      .json(new ApiResponse(201, "things working fine dear", null));
  } catch (error) {
    throw new apiError(
      402,
      "fault in health check api , REQUIRE MAINTAINANCE !!!!!!! "
    );
  }
});
export default healthcheckHandler;
