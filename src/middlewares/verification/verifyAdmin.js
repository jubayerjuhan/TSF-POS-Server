import jwt from "jsonwebtoken";
import ErrorHandler from "../../middlewares/error/errorHandler.js";
import User from "../../models/userModel.js";

/**
Middleware function to verify if the user is an admin
@function
@async
@param {Object} req - Express request object
@param {Object} res - Express response object
@param {Function} next - Express next function
@throws {ErrorHandler} If authorization failed
@returns {void}
*/
const verifyAdmin = async (req, res, next) => {
  // extracting the token from request header
  const token = req.headers.authorization?.split(" ")[1];
  console.log(token);
  if (!token) {
    // sending error if there is no token
    return next(new ErrorHandler(401, "Authorization failed!"));
  }
  try {
    //decoding the token and checking - and getting user id inside of token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // searching for the user on db with that token id
    const userId = decodedToken._id;
    const user = await User.findById(userId);

    // checking and sending error if the user is not admin
    if (!user || user.role !== "admin") {
      return next(new ErrorHandler(401, "Authorization failed!"));
    }

    // if all checks passed setting user on req.user
    req.user = user;
    next();
  } catch (err) {
    // if any error sending the error
    return next(new ErrorHandler(401, "Authorization failed!"));
  }
};

export default verifyAdmin;
