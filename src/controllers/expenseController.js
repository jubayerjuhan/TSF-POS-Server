import Expense from "../models/expenseModel.js";
import catchAsyncError from "../utils/catchAsyncError.js";

export const addExpense = catchAsyncError(async (req, res, next) => {
  // creating the branch
  const expense = await Expense.create({ ...req.body });
  res.status(200).json({
    success: true,
  });
});
