import BranchValuation from "../models/branchValuationModel.js";
import catchAsyncError from "../utils/catchAsyncError.js";

// Controller function to get all branch valuations
export const getBranchValuations = catchAsyncError(async (req, res, next) => {
  const { branch } = req.query;
  let branchValuations;
  let totalAmount = 0;

  if (branch) {
    branchValuations = await BranchValuation.find({ branch }).populate(
      "branch",
      "name"
    );
  } else {
    branchValuations = await BranchValuation.find().populate("branch", "name");
  }

  // Calculate the sum of amounts
  for (const valuation of branchValuations) {
    totalAmount += valuation.amount;
  }

  res.status(200).json({
    success: true,
    data: branchValuations,
    totalAmount: totalAmount,
  });
});

// Controller function to create a new branch valuation
export const createBranchValuation = catchAsyncError(async (req, res, next) => {
  const branchValuation = await BranchValuation.create(req.body);

  res.status(201).json({
    success: true,
    message: "Branch Valuation Added",
    data: branchValuation,
  });
});

// Controller function to delete a branch valuation
export const deleteBranchValuation = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const branchValuation = await BranchValuation.findByIdAndDelete(id);

  if (!branchValuation) {
    return next(new ErrorHandler(404, "Branch valuation not found"));
  }

  res.status(200).json({
    success: true,
    message: "Branch valuation deleted",
  });
});
