import Branch from "../models/branchModel.js";
import User from "../models/userModel.js";
import catchAsyncError from "../utils/catchAsyncError.js";

// Creating a user with create function
export const createUser = catchAsyncError(async (req, res, next) => {
  // creating user on mongo db
  const user = await User.create(req.body);

  // sending success response
  res.status(200).json({
    success: true,
    message: "User Creation Successful!",
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

  console.log(usersWithBranch);
  res.status(200).json({
    success: true,
    users: usersWithBranch,
  });
});
