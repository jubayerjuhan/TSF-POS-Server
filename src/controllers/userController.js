import Branch from "../models/branchModel.js";
import User from "../models/userModel.js";
import catchAsyncError from "../utils/catchAsyncError.js";

// Creating a user with create function
export const createUser = catchAsyncError(async (req, res, next) => {
  if (req.body.role === "admin") req.body.branch = undefined;
  // creating user on mongo db
  const user = await User.create(req.body);

  if (user.role !== "admin") {
    await Branch.findByIdAndUpdate(
      req.body.branch,
      {
        $addToSet: { moderators: user._id },
      },
      { new: true }
    );
  }

  // sending success response
  res.status(200).json({
    success: true,
    message: "User Creation Successful!",
  });
});
// Creating a user with create function
export const deleteUser = catchAsyncError(async (req, res, next) => {
  const userId = req.params.id;

  // Find and delete the user with the given id
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    // If user is not found, return a 404 error
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Return a success response if user is deleted successfully
  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

export const getUsersList = catchAsyncError(async (req, res, next) => {
  const users = await User.find();
  const branches = await Branch.find();

  const usersWithBranch = [];

  users.forEach((user) => {
    let branchName = "No Branch";
    branches.forEach((branch) => {
      const userExistInBranch = branch.moderators.includes(user._id);
      if (userExistInBranch) {
        branchName = branch.name;
      }
      if (user.role === "admin") {
        branchName = "All Branch";
      }
    });
    return usersWithBranch.push({ ...user._doc, branch: branchName });
  });

  res.status(200).json({
    success: true,
    users: usersWithBranch,
  });
});
