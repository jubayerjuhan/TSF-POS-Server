import BranchValuation from "../models/branchValuationModel";

// Controller function to get all branch valuations
export const getBranchValuations = catchAsyncError(async (req, res, next) => {
  const { branch } = req.query;
  let branchValuations;

  if (branch) {
    branchValuations = await BranchValuation.find({ branch }).populate(
      "branch"
    );
  } else {
    branchValuations = await BranchValuation.find().populate("branch");
  }

  res.status(200).json({
    success: true,
    data: branchValuations,
  });
});

// Controller function to create a new branch valuation
export const createBranchValuation = catchAsyncError(async (req, res, next) => {
  const { branch, value } = req.body;

  const branchValuation = await BranchValuation.create({ branch, value });

  res.status(201).json({
    success: true,
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
