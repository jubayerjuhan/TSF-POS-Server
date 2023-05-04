import catchAsyncError from "../utils/catchAsyncError.js";

export const addExpense = catchAsyncError(async (req, res, next) => {
  res.status(200).json({
    success: true,
  });
});
