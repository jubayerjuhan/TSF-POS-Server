// import ErrorHandler from "../../middlewares/error/errorHandler.js";
import ErrorHandler from "../../middlewares/error/errorHandler.js";
import Branch from "../../models/branchModel.js";
import catchAsyncError from "../../utils/catchAsyncError.js";

// Controller Function To Create a New Branch
export const createBranch = catchAsyncError(async (req, res, next) => {
  // Creating a new branch using the request body info
  const branch = await Branch.create(req.body);

  // Sending response back to client
  res.status(200).json({
    success: true,
    branch,
  });
});

// Controller Function To Delete Branch
export const deleteBranch = catchAsyncError(async (req, res, next) => {
  //extracting branchId from request
  const { branchId } = req.params;

  // throwing error if there is no branch id
  if (!branchId) return next(new ErrorHandler(400, "Branch Id Required"));

  // deleting a new branch using the request body info
  await Branch.findOneAndDelete(req.body);

  // Sending response back to client
  res.status(200).json({
    success: true,
    message: "Branch Deleted",
  });
});
