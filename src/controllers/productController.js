import ErrorHandler from "../middlewares/error/errorHandler.js";
import Product from "../models/productModel.js";
import catchAsyncError from "../utils/catchAsyncError.js";
import deleteFile from "../utils/files/deleteFile.js";
import { fileUrlParser } from "../utils/files/fileUrlParser.js";

// Controller Function To Add a Product To DB
export const createProduct = catchAsyncError(async (req, res, next) => {
  // parsing the file url to save database with the subfoldername
  const fileUrl = fileUrlParser(req.file);

  // finding the product with the product id if it exist or not
  const existingProductId = await Product.findOne({
    productId: req.body.productId,
  });

  // returning an error response if there is product with that id
  if (existingProductId) {
    deleteFile("products", req.file.filename);
    return next(new ErrorHandler(409, "Product With That Id Already Exists"));
  }

  // storing the product on database
  const product = await Product.create({ ...req.body, photo: fileUrl });

  res.status(200).json({
    success: true,
    product,
  });
});
