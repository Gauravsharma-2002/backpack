import { Playlist } from "../model/playlist.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { apiError } from "../utils/errors.js";

// want to add the max count of playlist that can be created for a particular user
const createPlaylist = asyncHandler(async (req, res) => {
  //   console.log("here in createPlaylist section ");
  //  playlist name , description ,videos array ,owner info
  // description may be optional but playlist name should be required feild

  //   Extract name and description from req.body
  //   Extract videoId from req.query

  //   If name or videoId is not provided
  //       Return response with status 400 and message "Playlist name and videoId are required"

  //   Create a new Playlist object with name, description, and videoId in the videos array

  //   Try
  //       Save the Playlist object to the database
  //       If successful
  //           Return response with status 201, message "Playlist created successfully", and the created playlist data
  //   Catch error
  //       Return response with status 500 and error message

  const { playlistName, description } = req.body;
  // user should be logged in
  const { id: ownerId } = req.user;

  const { videoId } = req.query;
  //   console.log(req.query);
  //   console.log(videoId)

  // checking for playlist name and video id
  if (!playlistName) {
    throw new apiError(402, "plalist Name is required to create playlist!!!");
  } else if (!videoId) {
    throw new apiError(402, "select atleast one video for creating playlist");
  }

  //   console.log(
  //     "playlist Demographics",
  //     playlistName,
  //     description,
  //     ownerId,
  //     videoId
  //   );
  try {
    const playlistObject = {
      name: playlistName?.toLowerCase(),
      description: description?.toLowerCase(),
      videos: [videoId],
      owner: ownerId
    };
    console.log("final playlist to be added value", playlistObject);
    const playlist = await Playlist.create({
      ...playlistObject
    }); //next i will verify if playlist created or not
    const createdPlaylist = await Playlist.findById(playlist._id);
    if (!createdPlaylist) {
      throw new apiError(
        502,
        "internal server error occured while creating playlist"
      );
    }
    console.log(createdPlaylist);
    return res
      .status(300)
      .json(
        new ApiResponse(200, "playlist created succesfully 😀", createdPlaylist)
      );
  } catch (error) {
    throw new apiError(402, error.message);
  }

  //   console.log({ playlistName, description, ownerId, videoId });
});
const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.query;
  const { name, description } = req.body;

  //   console.log(playlistId);
  if (!playlistId) {
    throw new apiError(
      401,
      "requires playlist id to update demographic details"
    );
  }

  if (!name || !description) {
    throw new apiError(
      402,
      "name and description are required feild to update playlist details"
    );
  }
  try {
    const UpdatedPlaylist = await Playlist.findByIdAndUpdate(playlistId, {
      $set: { name: name, description: description }
    });
    // here the returned may or may not contain correct value so it is required to make another call to fetch actual updated data
    //  but NOTE : this might affect performance so required "MODIFICATION"
    const gettingUpdatedPplaylist = await Playlist.findById(playlistId);

    return res
      .status(202)
      .json(
        new ApiResponse(
          202,
          "playlist demographics updated succesfully 😎",
          gettingUpdatedPplaylist
        )
      );
  } catch (error) {
    throw new apiError(
      502,
      error.message ||
        "internal server error occured while updating playlist demographics"
    );
  }
  // console.log("inside update playlist ")
  // return res.status(200).json(new ApiResponse(200,"inside update playlist",{}))
});
const addVideoToPlaylist = asyncHandler(async (req, res) => {});

export { createPlaylist, addVideoToPlaylist, updatePlaylist };
