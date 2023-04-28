import Sale from "../models/saleModel.js";
import catchAsyncError from "../utils/catchAsyncError.js";

// error handler function
import ErrorHandler from "../middlewares/error/errorHandler.js";

// controller function to add a sale
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

// controller function for deleting a sale
export const deleteSale = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const sale = await Sale.findByIdAndDelete(id);

  // throwing error if no sale with the id available
  if (!sale) return next(new ErrorHandler(400, "Sale Id Required"));

  res.status(200).json({
    success: true,
    message: "Sale Deleted",
  });
});

// controller function to get one sale document from database
export const getSale = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const sale = await Sale.findById(id);

  // throwing error if no sale with the id available
  if (!sale)
    return next(new ErrorHandler(404, "No sale found with this sale id"));

  res.status(200).json({
    success: true,
    sale,
  });
});

// controller function to get sales from one date to another
export const getSales = catchAsyncError(async (req, res, next) => {
  // getting the dates from body
  const { date } = req.body;

  // defining an empty array
  let allSales = [];

  /**
   * if date is available then find with date, if not available
   * then find without anything
   */
  if (!date) {
    const sales = await Sale.find().sort({ createdAt: -1 });
    allSales = sales;
  } else {
    const dateSales = await Sale.find({
      createdAt: { $gte: date.startDate, $lte: date.endDate },
    });
    allSales = dateSales;
  }

  // sending response to the server
  res.status(200).json({
    success: true,
    sales: allSales,
  });
});
