import ErrorHandler from "../middlewareS/error/errorHandler.js";
import User from "../models/userModel.js";
import catchAsyncError from "../utils/catchAsyncError.js";
import { sendJWTToken } from "../utils/sendJWTToken.js";

export const userLogin = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  //throwing a error if there is no email pr password on body
  if (!email || !password)
    return next(new ErrorHandler(404, "Email Or Password Not Found"));

  //searching for user with the email on Db
  const user = await User.findOne({ email }).select("+password");

  //throwing a error if there is no user with that email
  if (!user) return next(new ErrorHandler(404, "User Not Found"));

  //comparing password
  const isPasswordMatched = await user.comparePassword(password, user.password);

  //   throwing error if password don't match
  if (!isPasswordMatched)
    return next(new ErrorHandler(403, "Password Doesn't Match"));

  // if everything okay send the jwt token to user and login
  sendJWTToken(res, user);
});
