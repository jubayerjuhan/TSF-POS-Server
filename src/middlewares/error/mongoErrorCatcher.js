export const mongoErrorCatcher = (err, errorMessage) => {
  switch (err.name) {
    // if the error type is mongo db validation error
    case "ValidationError":
      errorMessage = ``;
      const fields = Object.keys(err.errors);
      for (let i = 0; i < fields.length; i++) {
        const isLastField = i === fields.length - 1;
        errorMessage += `${err.errors[fields[i]].message}${
          isLastField ? "" : ", "
        }`;
      }
      return errorMessage;

    // if there is duplicate key error c;,\]P,
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

    case "CastError":
      const modelType = err.model?.modelName;
      errorMessage = `Id ${err.value} Is Not a Valid ${modelType}`;
      return errorMessage;

    default:
      return errorMessage;
  }
};
