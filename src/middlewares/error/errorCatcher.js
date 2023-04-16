const errorMiddleware = (err, req, res, next) => {
  let errorMessage = err?.message || "Internal Server Error";
  const errorCode = err?.statusCode || 500;

  if (err.name === "ValidationError") {
    errorMessage = ``;
    for (const field in err.errors) {
      errorMessage += `${err.errors[field].message}, `;
    }
  }

  res?.status(errorCode).json({
    success: false,
    message: errorMessage,
  });
};

export default errorMiddleware;
