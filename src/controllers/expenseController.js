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
