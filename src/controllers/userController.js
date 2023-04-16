import User from "../models/userModel.js";
import catchAsyncError from "../utils/catchAsyncError.js";

// Creating a user with create function
export const createUser = catchAsyncError(async (req, res, next) => {
  // creating user on mongo db
  const user = await User.create(req.body);

  // sending success response
  res.status(200).json({
    success: true,
    user,
  });
});
