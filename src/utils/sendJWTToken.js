import jwt from "jsonwebtoken";
/**
Sends a JSON Web Token (JWT) to the client as a response to a successful login request.
@param {Object} res - The Express.js response object.
@param {Object} user - The user object that was authenticated.
@returns {void}
*/

export const sendJWTToken = (res, user) => {
  const token = jwt.sign(
    { _id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.status(200).json({
    success: true,
    token,
    user,
  });
};
