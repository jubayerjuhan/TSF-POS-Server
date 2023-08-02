import { v2 as cloudinary } from "cloudinary";
import ErrorHandler from "../../middlewares/error/errorHandler.js";

export const uploadImage = async (req, res) => {
  cloudinary.config({
    cloud_name: "dzao7wpux",
    api_key: "548429616525759",
    api_secret: "vUHEuynqNOgWG03_grr1EFBQKrU",
  });

  try {
    // Upload the image to Cloudinary and wait for the result
    const result = await cloudinary.uploader.upload(req.file.path);
    // Cloudinary response contains the image URL
    return result.secure_url;
  } catch (err) {
    console.log(err, "error");
    return new ErrorHandler(500, "Error Uploading Image");
  }
};
