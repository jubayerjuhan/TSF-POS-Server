import Product from "../models/productModel.js";
import catchAsyncError from "../utils/catchAsyncError.js";
import deleteFile from "../utils/files/deleteFile.js";
import { fileUrlParser } from "../utils/files/fileUrlParser.js";

// Controller Function To Add a Product To DB
export const createProduct = catchAsyncError(async (req, res, next) => {
  // parsing the file url to save database with the subfoldername
  const fileUrl = fileUrlParser(req.file);

  // storing the product on database
  const product = await Product.create({ ...req.body, photo: fileUrl });

  deleteFile("products", req.file.filename);
  res.status(200).json({
    success: true,
    product,
  });
});
