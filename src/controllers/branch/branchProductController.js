import ErrorHandler from "../../middlewares/error/errorHandler.js";
import Branch from "../../models/branchModel.js";
import catchAsyncError from "../../utils/catchAsyncError.js";

export const addProductToBranch = catchAsyncError(async (req, res, next) => {
  const { branchId } = req.params;

  //getting product from request body
  const { product } = req.body;

  //   sending error if there is no product in req body
  if (!product) return next(new ErrorHandler(400, "Product Required"));

  // Check if the product exists in the branch model
  const branch = await Branch.findOne({
    _id: branchId,
    "products.id": product.id,
  });

  //   sending error if there is already a product with the same id
  if (branch) {
    return res
      .status(400)
      .json({ message: "Product already exists in the branch" });
  }

  await Branch.findByIdAndUpdate(
    branchId,
    { $addToSet: { products: product } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    branch,
  });
});
