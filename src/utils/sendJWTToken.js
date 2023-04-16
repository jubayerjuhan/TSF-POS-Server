import jwt from "jsonwebtoken";
export const sendJWTToken = (user) => {
  console.log(user);
  const token = jwt.sign(
    { _id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  console.log(token);
};
