import { mongoErrorCatcher } from "../../middlewares/error/mongoErrorCatcher.js";

const errorMiddleware = (err, req, res, next) => {
  let errorMessage = err?.message || "Internal Server Error";
  const errorCode = err?.statusCode || 500;

  const message = mongoErrorCatcher(err, errorMessage);

  res?.status(errorCode).json({
    success: false,
    message,
  });
};

export default errorMiddleware;
