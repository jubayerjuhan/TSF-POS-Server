import ErrorHandler from "../middlewares/error/errorHandler.js";
import Expense from "../models/expenseModel.js";
import catchAsyncError from "../utils/catchAsyncError.js";

// controller function to add expense
export const addExpense = catchAsyncError(async (req, res, next) => {
  // getting branch from req query
  const { branch } = req.query;

  // creating the expense document in database
  await Expense.create({ ...req.body, branch });

  res.status(200).json({
    success: true,
    message: "Expense added",
  });
});

// controller function for deleting a expense
export const deleteExpense = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const expense = await Expense.findByIdAndDelete(id);

  // throwing error if no expense with the id available
  if (!expense) return next(new ErrorHandler(400, "Expense not available"));

  res.status(200).json({
    success: true,
    message: "Expense Deleted",
  });
});

// controller function to get one expense document from database
export const getExpense = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const expense = await Expense.findById(id).populate("branch", "name");

  // throwing error if no expense with the id available
  if (!expense)
    return next(new ErrorHandler(404, "No expense found with this expense id"));

  res.status(200).json({
    success: true,
    expense,
  });
});
