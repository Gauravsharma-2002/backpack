import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/errors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { Videos } from "../model/video.model.js";

const publishVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    throw new apiError(
      402,
      "title and description are required for the video to be uploaded !! "
    );
  }
  // express file upload
  // const {video, thumbnail} = req.files

  // console.log("\n")
  // console.log(req.files)

  // const videoPath = video[0]?.path;
  // const thumbnailPath = thumbnail[0]?.path;
  // now we require to inspect wether or not these paths exists or not
  // if(!videoPath){
  //   throw apiError(403," add a video")
  // }

  // console.log(typeof(thumbnailPath))

  //owner Details Required

  // const owner = await User.findById()
  // const owner= await User.find(req.user?._id)
  // not require to query the data base here as you have the access of the user that is uploading the video through the req.user._id { when the user is logged in }
  // console.log(req.user._id);

  // console.log(owner);
  // i only wanted the id of the user to be stored along within the video document

  const owner = req.user._id;
  const videoPath = req.files?.video[0]?.path;
  const thumbnailPath = req.files?.thumbnail[0]?.path;
  // these above line requires traditional cheking of presence
  // console.log(videoPath,"\n",thumbnailPath)
  if (!videoPath || !thumbnailPath) {
    // require some logical updates not showing the optimal error which is reqired
    throw new apiError(402, "video and thumbnail is reqired to update");
  }
  const video = await uploadOnCloudinary(videoPath);
  const thumbnail = await uploadOnCloudinary(thumbnailPath);
  if (!video || !thumbnail) {
    throw new apiError(
      502,
      "internal server error try uploading after some time"
    );
  }
  //  now i want the url and duration for the video , that will be taken from the vidoe object returned by the cloudinary response
  // console.log(video);
  const thumbnailUrl = thumbnail?.url;
  const videoUrl = video?.url;
  const videoDuration = video?.duration;
  // console.log(thumbnailUrl,videoUrl,videoDuration);

  // console.log(url,duration)
  const uploadedVideo = await Videos.create({
    videoFile: videoUrl,
    duration: videoDuration,
    thumbnail: thumbnailUrl,
    title: title,
    description: description,
    owner: owner
  });
  // console.log(uploadedVideo);
  if (!uploadedVideo) {
    throw new apiError(
      501,
      "error happend while uploading video due to server issues kindly try after a while !!!"
    );
  }
  return res
    .status(201)
    .json(
      new ApiResponse(
        202,
        " video uploaded successfully all good nothing to worry of dear 😎 ",
        uploadedVideo
      )
    );// and with this you made your video published 
});

export { publishVideo };
