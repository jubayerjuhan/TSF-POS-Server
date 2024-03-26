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


export const uploadImageArray = async (images, res) => {

  cloudinary.config({
    cloud_name: "dzao7wpux",
    api_key: "548429616525759",
    api_secret: "vUHEuynqNOgWG03_grr1EFBQKrU",
  });

  try {
    const uploadPromises = images.map(async (image, index) => {
      try {
        // Upload the image to Cloudinary and wait for the result
        const result = await cloudinary.uploader.upload(image.path);
        // Cloudinary response contains the image URL
        return result.secure_url;
      } catch (err) {
        console.log(err, 'error');
        throw new ErrorHandler(500, 'Error Uploading Image');
      }
    });

    // Use Promise.all to wait for all uploads to complete
    const uploadedUrls = await Promise.all(uploadPromises);

    // Return the array of uploaded URLs
    return uploadedUrls;
  } catch (error) {
    // Handle any errors that occurred during the image uploads
    console.error(error);
    throw error; // Re-throw the error for the calling function to handle
  }
};

