import User from "../models/userModel.js";
import catchAsyncError from "../utils/catchAsyncError.js";

export const createUser = catchAsyncError(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(200).json({
    success: true,
    user,
  });
});
