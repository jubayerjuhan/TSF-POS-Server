import crypto from "crypto";
import ErrorHandler from "../middlewares/error/errorHandler.js";
import User from "../models/userModel.js";
import catchAsyncError from "../utils/catchAsyncError.js";
import { sendJWTToken } from "../utils/sendJWTToken.js";
import sendEmail from "../utils/email/email.js";

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

// Controller function for forgot password
export const forgotPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.params;

  const user = await User.findOne({ email });
  // checking for user in database with the email
  if (!user) return next(new ErrorHandler(400, "Email Required"));

  // sending reset password token to user
  user.passwordReset.token = crypto.randomBytes(20).toString("hex");
  user.passwordReset.expiry = Date.now() + 3600000; // Expires in 1 hour
  await user.save();

  // setting recipent, params and template id for email
  const emailRecipent = [{ email: user.email, name: user.firstName }];
  const emailParams = {
    username: user.firstName,
    link: `${process.env.CLIENT_SIDE_LINK}/reset-password/${user.passwordReset.token}`,
  };

  sendEmail(emailRecipent, 5, emailParams, null);

  // making a random token
  res.status(200).json({
    success: true,
    message: "Password Reset Link Sent To Your Email",
  });
});
