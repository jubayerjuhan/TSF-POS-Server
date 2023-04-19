import catchAsyncError from "../utils/catchAsyncError.js";

// Controller Function To Add a Product To DB
export const createProduct = catchAsyncError(async (req, res, next) => {
  res.status(200).json({
    success: true,
  });
});
