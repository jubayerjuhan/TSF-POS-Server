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
    message: "Branch Created",
    branch,
  });
});

// Controller Function To Delete Branch
export const deleteBranch = catchAsyncError(async (req, res, next) => {
  //extracting branchId from request
  const { branchId } = req.params;

  // throwing error if there is no branch id
  if (!branchId) return next(new ErrorHandler(400, "Branch Id Required"));

  console.log(req.body);
  // deleting a new branch using the request body info
  const branch = await Branch.findByIdAndDelete(branchId);
  if (!branch) return next(new ErrorHandler(404, "No branch found"));

  res.status(200).json({
    success: true,
    message: "Branch Deleted",
  });

  // Sending response back to client
});

// Controller Function To Edit Branch Information
export const editBranch = catchAsyncError(async (req, res, next) => {
  //extracting branchId from request
  const { branchId } = req.params;
  const { name, address } = req.body;

  // throwing error if there is no branch id
  if (!branchId) return next(new ErrorHandler(400, "Branch Id Required"));

  const branch = await Branch.findById(branchId);

  // throwing error if there is no branch with that id
  if (!branch)
    return next(new ErrorHandler(404, "No Branch Found With The Id"));

  // throwing error if there is no name or location
  if (!name && !address)
    return next(new ErrorHandler(400, "Name Or Location Required To Edit"));

  // deleting a new branch using the request body info
  await Branch.findByIdAndUpdate(branchId, req.body);

  // Sending response back to client
  res.status(200).json({
    success: true,
    message: "Branch Information Edited",
  });
});

// Controller function to get branch information
export const getBranchInformation = catchAsyncError(async (req, res, next) => {
  //extracting branchId from request
  const { branchId } = req.params;

  // throwing error if there is no branch id
  if (!branchId) return next(new ErrorHandler(400, "Branch Id Required"));

  // getting branch with products and moderators populated
  const branch = await Branch.findById(branchId).populate(
    "products.id moderators"
  );

  if (!branch)
    return next(new ErrorHandler(404, "No Branch Found With This Id"));

  // sending response back to server

  res.status(200).json({
    success: true,
    branch,
  });
});

// controller function to get all branches
export const getAllBranches = catchAsyncError(async (req, res, next) => {
  const branches = await Branch.find({}).select("name address");
  res.status(200).json({
    success: true,
    branches: branches,
  });
});
