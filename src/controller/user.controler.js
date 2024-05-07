import { asyncHandler } from "../utils/asyncHandler.js";

 const registerUser = asyncHandler(async (req, res) => {
  return res.status(200).json({
    message: "ok",
  });
});

export const loginUser = asyncHandler(async (req, res) => {
 return res.status(200).json({
    message: "ok login",
  });
});
//now go and call this function when particular route is hit in router section

export {registerUser,}