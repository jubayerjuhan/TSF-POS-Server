import ErrorHandler from "../middlewares/error/errorHandler.js";
import Branch from "../models/branchModel.js";
import Product from "../models/productModel.js";
import Sale from "../models/saleModel.js";
import catchAsyncError from "../utils/catchAsyncError.js";
import deleteFile from "../utils/files/deleteFile.js";
import { fileUrlParser } from "../utils/files/fileUrlParser.js";
import { uploadImage } from "../utils/uploadImage/uploadImage.js";

// Controller Function To Add a Product To DB
export const createProduct = catchAsyncError(async (req, res, next) => {
  const image = await uploadImage(req, res, next);

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
  const product = await Product.create({ ...req.body, photo: image });

  res.status(200).json({
    success: true,
    message: "Product Added Successfully",
    product,
  });
});

// Controller function to get all products with total stock and branch-wise stock
export const getProductList = catchAsyncError(async (req, res, next) => {
  // Fetch all products
  const products = await Product.find().sort({ createdAt: -1 });;

  // Fetch all branches
  const branches = await Branch.find();

  // Fetch sales data for each product
  const productSales = await Sale.aggregate([
    {
      $unwind: "$items",
    },
    {
      $group: {
        _id: "$items.id",
        sales: { $sum: "$items.quantity" },
      },
    },
  ]);

  // Create a mapping of product IDs to their sales count
  const productSalesMap = new Map();
  productSales.forEach((sale) => {
    productSalesMap.set(sale._id.toString(), sale.sales);
  });

  // Calculate total stock for each product and branch-wise stock, and add sales data
  const productsWithTotalStockAndSales = products.map((product) => {
    // Initialize total stock for the current product
    let totalStock = 0;

    // Initialize an array to hold branch-wise stock details
    const branchStocks = [];

    // Loop through each branch
    branches.forEach((branch) => {
      // Find the product in the branch's products array
      const branchProduct = branch.products.find(
        (item) => item.id.toString() === product._id.toString()
      );

      // If the product exists in the branch, add its quantity to the total stock
      if (branchProduct) {
        totalStock += branchProduct.quantity || 0;
        branchStocks.push({
          branchName: branch.name,
          stock: branchProduct.quantity || 0,
        });
      }
    });

    // Get the sales count for the current product
    const sales = productSalesMap.get(product.productId.toString()) || 0;

    // Create a new object with the product details, total stock, and branch-wise stock details
    return {
      ...product.toJSON(),
      totalStock,
      branchStocks,
      sales,
    };
  });

  res.status(200).json({
    success: true,
    products: productsWithTotalStockAndSales,
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
  let imageLink = product.photo;

  if (req.file) {
    const image = await uploadImage(req, res, next);
    imageLink = image;
  }

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

  // update the product and send back the updated product
  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    { ...req.body, photo: imageLink },
    { new: true }
  );
  res.status(200).json({
    success: true,
    message: "Edit Product Successful",
    product: updatedProduct,
  });
});

// controller function to search product
export const searchProduct = catchAsyncError(async (req, res, next) => {
  const { productId } = req.query;

  // searching for product with the custom product id
  const product = await Product.findOne({ productId });

  // throwing error if product id doesn't matches any any id
  if (!product)
    return next(new ErrorHandler(404, "No product found with this id"));

  // searching for branches the product is available
  const branches = await Branch.aggregate([
    { $match: { "products.id": product._id } },
    {
      $project: {
        _id: 0,
        name: 1,
        quantity: {
          $arrayElemAt: [
            {
              $map: {
                input: {
                  $filter: {
                    input: "$products",
                    cond: { $eq: ["$$this.id", product._id] },
                  },
                },
                as: "product",
                in: "$$product.quantity",
              },
            },
            0,
          ],
        },
      },
    },
  ]);

  // Search for sales that include the product
  const sales = await Sale.find({ "items.id": product.productId }).populate(
    "branch"
  );

  // sending the product and the branchs the product available in
  res.status(200).json({
    success: true,
    product: { ...product._doc, branches, sales },
  });
});
