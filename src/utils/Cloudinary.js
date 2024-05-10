import { v2 as cloudinary, v2 } from "cloudinary";
import fs from "fs";
cloudinary.config({
  cloud_name: `${process.env.CLOUDINARY_NAME}`,
  api_key: `${process.env.CLOUDINARY_API_KEY}`,
  api_secret: `${process.env.CLOUDINARY_API_SECRET}`,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    // uploading on cloudinary
    // if no file is in input return null
    //  else upload it at cloudinary
    // const response = await cloudinary.uploader.upload(
    //   "https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
    //   { resource_type: "auto" }
    // );
    // console.log("inCloud",typeof(localFilePath))
    // console.log("is heer \n")
    if (!localFilePath) return null;
    // console.log("does heer")
    const fileUpload = await v2.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    //file has been uploaded sucessfully
    // console.log("fille uploaded sucessfull", fileUpload.url);
    fs.unlinkSync(localFilePath);
    return fileUpload; // returning whole cloudinary response to user
  } catch (error) {
    //remove temporary saved local file as upload failed on server
    fs.unlinkSync(localFilePath); // making it sync because we want to remove the locally saved temp file as upload gets failed
    return null;
  }
};

export { uploadOnCloudinary };
