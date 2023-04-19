export const mongoErrorCatcher = (err, errorMessage) => {
  switch (err.name) {
    // if the error type is mongo db validation error
    case "ValidationError":
      errorMessage = ``;
      for (const field in err.errors) {
        errorMessage += `${err.errors[field].message}, `;
      }
      return errorMessage;

    // if there is duplicate key error
    case "MongoServerError":
      errorMessage = ``;

      if (err.code === 11000) {
        for (const field in err.keyValue) {
          errorMessage = `${
            field.charAt(0).toUpperCase() + field.slice(1)
          } Is Duplicate `;
        }
        return errorMessage;
      }

    default:
      return errorMessage;
  }
};
