import Sale from "../models/saleModel.js";
import catchAsyncError from "../utils/catchAsyncError.js";

// error handler function
import ErrorHandler from "../middlewares/error/errorHandler.js";

export const makeSale = catchAsyncError(async (req, res, next) => {
  const sale = await Sale.create(req.body);

  // checking if total payment is less than partial payment amount
  if (req.body.total < req.body.partialPaymentAmount)
    return next(
      new ErrorHandler(400, "Partial payment is more than total amount")
    );

  res.status(200).json({
    success: true,
    sale: sale,
    message: "Sale Successfully Made",
  });
});
