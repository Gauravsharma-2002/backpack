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
    ); // and with this you made your video published
  //question i wish to ask while making  this controllere from chat gpt but the question give me the solution : "consider yourself a nodejs backend developer with expertise in MERN stack , now you got a question that you have to query the database for only the id of a document"
});
const getVideoById = asyncHandler(async (req, res) => {
  const videoId = req.params;

  // console.log(videoId.id)
  // console.log(req.params);

  //before making a query we must ensure that there is some thing in params

  const video = await Videos.findById(videoId.id);

  if (!video) {
    return res
      .status(402)
      .json(new ApiResponse(402, "opps no video for this id exists ", {}));
  }
  // console.log(video);
  return res
    .status(200)
    .json(new ApiResponse(201, "video fetched succesfully", video));
});
// also add an undo route OR it may be handled in frontend
const deleteVideoByItsId = asyncHandler(async (req, res) => {
  // require video id for getting deleted
  const { id: videoId } = req.params;
  // if video doesn't exist then it returns the null value hence can not delete or either if video doesn't get deleted from db again get null in response
  const deletedVideoInfo = await Videos.findByIdAndDelete(videoId, {
    lean: true
  });
  // console.log(deletedVideoInfo);
  if (!deletedVideoInfo) {
    throw new apiError(402, "no such video exit mf 🙂,get lost ");
  }
  return res
    .status(202)
    .json(
      new ApiResponse(
        202,
        `video with id : ${videoId}, deleted sucessfully`,
        deletedVideoInfo
      )
    );
});

const updateVideo = asyncHandler(async (req, res) => {
  const videoId = req.params;
  // console.log(videoId?.id);

  if (!videoId?.id) {
    throw new apiError(
      401,
      "video_id is required to update the demographics 🚓"
    );
  }
  // console.log(req.body)
  const { title, description } = req.body;
  //ALWAYS remeber this thing that IF USING MULTIPART do include middleware in route unless your req.body will be empty
  // console.log(title,description)
  if (!title || !description) {
    throw new apiError(
      402,
      "title and description are required for the video to be uploaded !! "
    );
  }

  // like here i m just throwing the error if the new items are not available, i can also do the updation based on the fact that if something is missing the previous value retains in the db
  const unupdatedVideoDoc = await Videos.findById(videoId?.id);
  // console.log(unupdatedVideoDoc);
  if (!unupdatedVideoDoc) {
    return res
      .status(402)
      .json(new ApiResponse(402, "no such video exists", {}));
  }

  //now add the thumbnail
  const thumbnailPath = req.file.path;
  if (!thumbnailPath) {
    throw new apiError(402, "do add the thumbnail for updation");
  }

  // console.log(thumbnail);
  const thumbnail = await uploadOnCloudinary(thumbnailPath);
  // console.log(thumbnail.url);

  unupdatedVideoDoc.title = title;
  unupdatedVideoDoc.description = description;
  unupdatedVideoDoc.thumbnail = thumbnail;
  const updatedVideoDoc = await unupdatedVideoDoc.save({
    validateBeforeSave: false
  });
  // console.log(updatedVideoDoc);
  if (!updatedVideoDoc) {
    throw new apiError(501, "internal server Error occured !!!");
  }

  return res
    .status(202)
    .json(
      new ApiResponse(
        202,
        " demographic details of video updated succes fully ",
        updatedVideoDoc
      )
    );
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  // console.log("inside toggle publish status");
  const { id: videoId } = req.params;
  // console.log(videoId);
  const updatedToggleStatus = await Videos.findByIdAndUpdate(videoId, {
    $set: {
      isPublished: !isPublished
    }
  });
  if (!updatedToggleStatus) {
    throw new apiError(402, "network error unable to toggle status");
  }
  return res
    .status(202)
    .json(new ApiResponse(200, "things good inside here", updatedToggleStatus));
  // cosnt {}
});

const getAllVideos = asyncHandler(async (req, res) => {
  console.log("inside get all videos method");
  return res.status(200).json(new ApiResponse(201, "getting all videos", {}));
});

export {
  publishVideo,
  getVideoById,
  updateVideo,
  deleteVideoByItsId,
  togglePublishStatus,
  getAllVideos
};
