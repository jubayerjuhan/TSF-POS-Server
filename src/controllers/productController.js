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

// Controller function to delete product
export const deleteProduct = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  // throwing error if there is no product id
  if (!id) return next(new ErrorHandler(400, "Product Id Required"));

  // getting the product first from the database to get image url
  const product = await Product.findById(id);
  // parsing the photoUrl
  const photoUrl = product.photo.split("/products/")[1];

  // deleting the product photo from server
  deleteFile("products", photoUrl);

  // deleting the product
  await Product.findByIdAndDelete(id);

  // sending response back to client
  res.status(200).json({
    success: true,
    message: "Product Deleted!",
  });
});

// controller function to update the product
export const editProduct = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  // searching for product with the req id
  const product = await Product.findById(id);

  // sending error if there is no product with the id
  if (!product)
    return next(new ErrorHandler(400, "No Product Found With This Id"));

  /**
   * Making the photo variable undefined because if user don't pass the
   * photo with req it don't get erased or replaced with and empty string ""
   */
  let photo = undefined;

  /**
   * if the req has a photo / file remove previous photo from server and store new photo on
   * photo variable
   */

  if (req.file) {
    const photoUrl = product.photo.split("/products/")[1];
    deleteFile("products", photoUrl);
    photo = fileUrlParser(req.file);
  }

  // update the product and send back the updated product
  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    { ...req.body, photo },
    { new: true }
  );
  res.status(200).json({
    success: true,
    product: updatedProduct,
  });
});
